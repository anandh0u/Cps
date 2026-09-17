import { Router, type IRouter, type Request } from "express";
import { and, asc, desc, eq, gte, ilike, or } from "drizzle-orm";
import {
  db,
  departmentProfileTable,
  eventsTable,
  facultyTable,
  highlightTable,
  newsTable,
  notificationsTable,
  studentsTable,
} from "@workspace/db";
import {
  CreateSessionBody,
  CreateSessionResponse,
  GetDashboardResponse,
  GetEventsQueryParams,
  GetEventsResponse,
  GetFacultyResponse,
  GetNewsResponse,
  GetNotificationsResponse,
  GetSessionResponse,
  GetStudentsQueryParams,
  GetStudentsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const sessionUser = {
  name: "CPS Portal User",
  email: "student@gec.ac.in",
  role: "Student",
  initials: "CP",
};

function currentSession(req: Request) {
  return req.signedCookies?.cps_session === "demo"
    ? { authenticated: true, user: sessionUser }
    : { authenticated: false, user: null };
}

router.get("/dashboard", async (_req, res): Promise<void> => {
  const [profile, highlights, students, faculty, events, news, notifications] =
    await Promise.all([
      db.select().from(departmentProfileTable).limit(1),
      db.select().from(highlightTable).orderBy(asc(highlightTable.id)),
      db.select().from(studentsTable).orderBy(asc(studentsTable.id)),
      db.select().from(facultyTable).orderBy(asc(facultyTable.id)),
      db
        .select()
        .from(eventsTable)
        .where(gte(eventsTable.date, new Date().toISOString().slice(0, 10)))
        .orderBy(asc(eventsTable.date)),
      db
        .select()
        .from(newsTable)
        .orderBy(desc(newsTable.publishedAt))
        .limit(3),
      db
        .select()
        .from(notificationsTable)
        .where(eq(notificationsTable.read, false))
        .orderBy(desc(notificationsTable.createdAt)),
    ]);

  const data = {
    profile: profile[0],
    counts: {
      students: students.length,
      faculty: faculty.length,
      upcomingEvents: events.length,
      unreadNotifications: notifications.length,
    },
    highlights,
    upcomingEvents: events,
    latestNews: news,
  };

  res.json(GetDashboardResponse.parse(data));
});

router.get("/students", async (req, res): Promise<void> => {
  const parsed = GetStudentsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, year } = parsed.data;
  const filters = [];
  if (year) filters.push(ilike(studentsTable.year, year));
  if (search) {
    filters.push(
      or(
        ilike(studentsTable.name, `%${search}%`),
        ilike(studentsTable.rollNumber, `%${search}%`),
        ilike(studentsTable.focus, `%${search}%`),
      ),
    );
  }

  const students = await db
    .select()
    .from(studentsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(asc(studentsTable.name));

  res.json(GetStudentsResponse.parse(students));
});

router.get("/faculty", async (_req, res): Promise<void> => {
  const faculty = await db
    .select()
    .from(facultyTable)
    .orderBy(asc(facultyTable.name));
  res.json(GetFacultyResponse.parse(faculty));
});

router.get("/events", async (req, res): Promise<void> => {
  const parsed = GetEventsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const events = await db
    .select()
    .from(eventsTable)
    .where(
      parsed.data.upcoming
        ? gte(eventsTable.date, new Date().toISOString().slice(0, 10))
        : undefined,
    )
    .orderBy(asc(eventsTable.date));

  res.json(GetEventsResponse.parse(events));
});

router.get("/news", async (_req, res): Promise<void> => {
  const news = await db
    .select()
    .from(newsTable)
    .orderBy(desc(newsTable.publishedAt));
  res.json(GetNewsResponse.parse(news));
});

router.get("/notifications", async (_req, res): Promise<void> => {
  const notifications = await db
    .select()
    .from(notificationsTable)
    .orderBy(desc(notificationsTable.createdAt));
  res.json(GetNotificationsResponse.parse(notifications));
});

router.get("/auth/session", (req, res): void => {
  res.json(GetSessionResponse.parse(currentSession(req)));
});

router.post("/auth/session", (req, res): void => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(401).json({ error: "Enter a valid institutional email and password." });
    return;
  }

  if (
    parsed.data.email !== "student@gec.ac.in" ||
    parsed.data.password !== "cps2026"
  ) {
    res.status(401).json({ error: "The email or password is incorrect." });
    return;
  }

  res.cookie("cps_session", "demo", {
    httpOnly: true,
    sameSite: "lax",
    signed: true,
    maxAge: 1000 * 60 * 60 * 8,
  });
  res.json(
    CreateSessionResponse.parse({ authenticated: true, user: sessionUser }),
  );
});

export default router;