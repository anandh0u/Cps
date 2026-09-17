import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const departmentProfileTable = pgTable("department_profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  institution: text("institution").notNull(),
  shortName: text("short_name").notNull(),
  location: text("location").notNull(),
  established: text("established").notNull(),
  description: text("description").notNull(),
});

export const highlightTable = pgTable("highlights", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  detail: text("detail").notNull(),
  tone: text("tone").notNull(),
});

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rollNumber: text("roll_number").notNull().unique(),
  year: text("year").notNull(),
  semester: text("semester").notNull(),
  email: text("email").notNull(),
  focus: text("focus").notNull(),
  avatarUrl: text("avatar_url"),
});

export const facultyTable = pgTable("faculty", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  designation: text("designation").notNull(),
  specialization: text("specialization").notNull(),
  email: text("email").notNull(),
  office: text("office").notNull(),
  avatarUrl: text("avatar_url"),
});

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: date("date", { mode: "string" }).notNull(),
  time: text("time").notNull(),
  venue: text("venue").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
});

export const newsTable = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  publishedAt: date("published_at", { mode: "string" }).notNull(),
  category: text("category").notNull(),
  featured: boolean("featured").notNull().default(false),
});

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  category: text("category").notNull(),
  read: boolean("read").notNull().default(false),
});

export const insertDepartmentProfileSchema = createInsertSchema(
  departmentProfileTable,
).omit({ id: true });
export const insertHighlightSchema = createInsertSchema(highlightTable).omit({
  id: true,
});
export const insertStudentSchema = createInsertSchema(studentsTable).omit({
  id: true,
});
export const insertFacultySchema = createInsertSchema(facultyTable).omit({
  id: true,
});
export const insertEventSchema = createInsertSchema(eventsTable).omit({
  id: true,
});
export const insertNewsSchema = createInsertSchema(newsTable).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(
  notificationsTable,
).omit({ id: true, createdAt: true });

export type DepartmentProfile = z.infer<typeof insertDepartmentProfileSchema>;
export type Highlight = z.infer<typeof insertHighlightSchema>;
export type Student = z.infer<typeof insertStudentSchema>;
export type Faculty = z.infer<typeof insertFacultySchema>;
export type Event = z.infer<typeof insertEventSchema>;
export type NewsItem = z.infer<typeof insertNewsSchema>;
export type Notification = z.infer<typeof insertNotificationSchema>;