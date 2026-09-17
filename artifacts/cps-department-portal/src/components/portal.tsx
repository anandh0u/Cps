import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleAlert,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  getGetSessionQueryKey,
  useCreateSession,
  useGetDashboard,
  useGetEvents,
  useGetFaculty,
  useGetNews,
  useGetNotifications,
  useGetSession,
  useGetStudents,
} from '@workspace/api-client-react';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: GraduationCap },
  { href: '/faculty', label: 'Faculty', icon: Users },
  { href: '/events', label: 'Events', icon: CalendarDays },
  { href: '/news', label: 'News & notices', icon: Newspaper },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

function initials(name = '') {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'CPS';
}

function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', options ?? { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function formatDay(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? { day: '--', month: '---' } : {
    day: new Intl.DateTimeFormat('en-IN', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(date).toUpperCase(),
  };
}

function Avatar({ name, src, size = 'md' }: { name: string; src?: string | null; size?: 'sm' | 'md' | 'lg' }) {
  return src ? (
    <img src={src} alt={name} className={`avatar avatar-${size}`} data-testid={`img-avatar-${name}`} />
  ) : (
    <div className={`avatar avatar-${size} avatar-fallback`} data-testid={`avatar-${name}`}>{initials(name)}</div>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

function QueryState({ loading, error, onRetry, children }: { loading: boolean; error: boolean; onRetry: () => void; children: ReactNode }) {
  if (loading) return <div className="space-y-3" data-testid="status-loading">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-20 w-full" />)}</div>;
  if (error) return (
    <div className="empty-state" data-testid="status-error">
      <div className="empty-icon"><CircleAlert size={20} /></div>
      <h3>We could not load this view</h3>
      <p>The department feed is taking a moment. Try again.</p>
      <button className="button button-dark mt-4" onClick={onRetry} data-testid="button-retry">Try again</button>
    </div>
  );
  return <>{children}</>;
}

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="kicker mb-2">{eyebrow}</p>}
        <h2 className="text-2xl font-extrabold tracking-[-.03em] text-foreground sm:text-[1.7rem]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function PortalSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const { data: session } = useGetSession();
  const user = session?.user;
  return (
    <aside className="portal-sidebar flex shrink-0 flex-col px-4 py-5 md:min-h-screen md:px-5" data-testid="portal-sidebar">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="brand-mark"><span>CP</span><i /></div>
        <div>
          <p className="text-[13px] font-extrabold tracking-tight text-white">CPS Engineering</p>
          <p className="mt-0.5 font-mono-ui text-[9px] uppercase tracking-[.14em] text-slate-400">GEC Thrissur / 1989</p>
        </div>
      </div>
      <p className="kicker mb-3 px-3 text-slate-500">Department desk</p>
      <nav className="space-y-1" aria-label="Department navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = location === href;
          return (
            <Link href={href} key={href} onClick={onNavigate} className={`nav-link ${active ? 'nav-link-active' : ''}`} data-testid={`link-nav-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
              <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
              {label === 'Notifications' && <span className="nav-dot" />}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto hidden border-t border-slate-700/70 pt-5 md:block">
        <div className="flex items-center gap-3 px-2">
          <Avatar name={user?.name ?? 'CPS Member'} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-100" data-testid="text-sidebar-user">{user?.name ?? 'Department member'}</p>
            <p className="truncate text-[10px] text-slate-500">{user?.role ?? 'Academic community'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function PortalLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const activeLabel = navItems.find((item) => item.href === location)?.label ?? 'Department portal';
  const { data: session } = useGetSession();
  return (
    <div className="portal-shell flex flex-col md:flex-row">
      <div className="mobile-topbar">
        <button className="icon-button" onClick={() => setMobileOpen((value) => !value)} aria-label="Open navigation" data-testid="button-mobile-menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2.5"><div className="brand-mark brand-mark-small"><span>CP</span><i /></div><span className="font-extrabold tracking-tight">CPS Engineering</span></div>
        <Link href="/notifications" className="icon-button relative" aria-label="Notifications" data-testid="link-mobile-notifications"><Bell size={18} /><span className="mobile-alert-dot" /></Link>
      </div>
      <div className={`${mobileOpen ? 'mobile-drawer mobile-drawer-open' : 'mobile-drawer'}`}><PortalSidebar onNavigate={() => setMobileOpen(false)} /></div>
      <div className="hidden md:block"><PortalSidebar /></div>
      <main className="portal-main">
        <header className="portal-header">
          <div>
            <p className="kicker">{activeLabel}</p>
            <p className="mt-1 text-xs text-muted-foreground">Government Engineering College, Thrissur</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/notifications" className="header-notification" aria-label="Open notifications" data-testid="link-header-notifications"><Bell size={17} /><span /></Link>
            <div className="hidden text-right sm:block"><p className="text-xs font-bold" data-testid="text-header-user">{session?.user?.name ?? 'Department member'}</p><p className="font-mono-ui text-[10px] text-muted-foreground">{session?.user?.role ?? 'Academic community'}</p></div>
            <Avatar name={session?.user?.name ?? 'CPS Member'} size="sm" />
          </div>
        </header>
        <div className="portal-content">{children}</div>
      </main>
    </div>
  );
}

function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return (
    <div className="page-intro animate-enter">
      <div><p className="kicker mb-3 text-accent">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>
      {children}
    </div>
  );
}

function MetricCard({ label, value, detail, icon: Icon, accent }: { label: string; value: string | number; detail: string; icon: typeof Users; accent?: string }) {
  return (
    <div className={`metric-card ${accent ?? ''}`} data-testid={`metric-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
      <div className="flex items-start justify-between"><p className="kicker">{label}</p><div className="metric-icon"><Icon size={17} /></div></div>
      <p className="mt-5 text-[2rem] font-extrabold tracking-[-.06em] text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

export function DashboardPage() {
  const query = useGetDashboard();
  const dashboard = query.data;
  if (!dashboard) return <QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}><DashboardSkeleton /></QueryState>;
  const { profile, counts, highlights = [], upcomingEvents = [], latestNews = [] } = dashboard;
  return (
    <div className="space-y-8">
      <div className="hero-panel texture-grid animate-enter">
        <div className="relative z-10 max-w-2xl">
          <p className="kicker mb-4 text-accent">CPS / Department overview</p>
          <h1 className="max-w-xl text-[2.2rem] font-extrabold leading-[1.08] tracking-[-.055em] text-white sm:text-[3rem]" data-testid="text-dashboard-welcome">A clear signal for the work ahead.</h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300" data-testid="text-dashboard-description">{profile.description}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-slate-300"><span className="inline-flex items-center gap-2"><MapPin size={14} className="text-accent" />{profile.location}</span><span className="text-slate-600">/</span><span className="font-mono-ui text-[11px] text-slate-400">EST. {profile.established}</span></div>
        </div>
        <div className="hero-orbit" aria-hidden="true"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><span className="orbit-core">CPS</span><span className="orbit-node node-a" /><span className="orbit-node node-b" /><span className="orbit-node node-c" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Students" value={counts.students} detail="Across four academic years" icon={GraduationCap} />
        <MetricCard label="Faculty" value={counts.faculty} detail="Teaching & research staff" icon={Users} accent="metric-accent" />
        <MetricCard label="Upcoming events" value={counts.upcomingEvents} detail="On the department calendar" icon={CalendarDays} />
        <MetricCard label="Unread updates" value={counts.unreadNotifications} detail="Worth your attention" icon={Bell} accent="metric-warm" />
      </div>
      <div className="grid gap-8 xl:grid-cols-[1.15fr_.85fr]">
        <section className="space-y-4 animate-enter-delay-1">
          <SectionHeading eyebrow="Next on the bench" title="Upcoming events" action={<Link className="subtle-link" href="/events" data-testid="link-view-events">View calendar <ArrowRight size={14} /></Link>} />
          <div className="portal-card divide-y divide-border overflow-hidden">
            {upcomingEvents.length ? upcomingEvents.slice(0, 4).map((event) => <EventRow key={event.id} event={event} />) : <EmptyInline label="No upcoming events have been scheduled." />}
          </div>
        </section>
        <section className="space-y-4 animate-enter-delay-2">
          <SectionHeading eyebrow="Fresh from the department" title="Latest news" action={<Link className="subtle-link" href="/news" data-testid="link-view-news">All news <ArrowRight size={14} /></Link>} />
          <div className="space-y-3">
            {latestNews.length ? latestNews.slice(0, 3).map((item) => <NewsCard compact key={item.id} item={item} />) : <EmptyInline label="No news has been published yet." />}
          </div>
        </section>
      </div>
      {!!highlights.length && <section className="highlight-strip animate-enter-delay-3"><div><p className="kicker text-accent">The CPS perspective</p><h2>Built around systems that meet the real world.</h2></div><div className="highlight-items">{highlights.slice(0, 3).map((highlight) => <div key={highlight.label}><p className="font-mono-ui text-2xl font-medium text-accent">{highlight.value}</p><p className="mt-1 text-xs font-bold text-slate-200">{highlight.label}</p><p className="mt-1 text-[11px] leading-5 text-slate-400">{highlight.detail}</p></div>)}</div></section>}
    </div>
  );
}

function DashboardSkeleton() {
  return <div className="space-y-5"><Skeleton className="h-72 w-full" /><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-36" />)}</div><Skeleton className="h-72 w-full" /></div>;
}

function EventRow({ event, detailed = false }: { event: any; detailed?: boolean }) {
  const day = formatDay(event.date);
  return <article className={`event-row ${detailed ? 'event-row-detailed' : ''}`} data-testid={`card-event-${event.id}`}><div className="event-date"><strong>{day.day}</strong><span>{day.month}</span></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="tag">{event.type}</span><span className="text-[11px] text-muted-foreground">{event.time}</span></div><h3 className="mt-2 truncate text-sm font-extrabold tracking-[-.015em]">{event.title}</h3><p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground"><MapPin size={12} />{event.venue}</p>{detailed && <p className="mt-3 text-sm leading-6 text-muted-foreground">{event.description}</p>}</div>{!detailed && <ChevronRight size={16} className="shrink-0 text-muted-foreground" />}</article>;
}

function NewsCard({ item, compact = false }: { item: any; compact?: boolean }) {
  return <article className={`news-card portal-card portal-card-hover ${compact ? 'news-card-compact' : ''}`} data-testid={`card-news-${item.id}`}><div className="news-card-bar"><span className="tag">{item.category}</span>{item.featured && <span className="featured-label"><Sparkles size={11} /> Featured</span>}</div><h3>{item.title}</h3><p>{item.excerpt}</p><div className="mt-auto flex items-center justify-between pt-5"><span className="font-mono-ui text-[10px] text-muted-foreground">{formatDate(item.publishedAt)}</span><ArrowRight size={15} className="text-accent" /></div></article>;
}

function EmptyInline({ label }: { label: string }) {
  return <div className="p-8 text-center text-sm text-muted-foreground" data-testid="status-empty">{label}</div>;
}

export function StudentsPage() {
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('all');
  const query = useGetStudents({ search: search || undefined, year: year === 'all' ? undefined : year });
  const students = query.data ?? [];
  return <div className="space-y-7"><PageIntro eyebrow="People / Learners" title="Student directory" description="Find the people shaping their own path through cyber physical systems."><span className="page-count">{students.length} profiles</span></PageIntro><div className="filter-bar"><div className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, roll number or focus" aria-label="Search students" data-testid="input-search-students" /></div><select value={year} onChange={(event) => setYear(event.target.value)} aria-label="Filter students by year" data-testid="select-student-year"><option value="all">All years</option><option value="S4">S4</option><option value="S6">S6</option><option value="S8">S8</option><option value="First Year">First year</option><option value="Second Year">Second year</option><option value="Third Year">Third year</option><option value="Fourth Year">Fourth year</option></select></div><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}>{students.length ? <div className="directory-grid">{students.map((student) => <article className="person-card portal-card portal-card-hover" key={student.id} data-testid={`card-student-${student.id}`}><div className="flex items-start justify-between"><Avatar name={student.name} src={student.avatarUrl} size="lg" /><span className="tag">{student.year}</span></div><h3 className="mt-5">{student.name}</h3><p className="font-mono-ui text-[10px] uppercase tracking-wider text-accent">{student.rollNumber}</p><p className="mt-4 text-xs font-semibold text-muted-foreground">{student.focus}</p><div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground"><p>{student.semester}</p><a href={`mailto:${student.email}`} className="mt-1 flex items-center gap-1.5 truncate text-foreground hover:text-accent" data-testid={`link-email-student-${student.id}`}><Mail size={12} />{student.email}</a></div></article>)}</div> : <div className="empty-state"><div className="empty-icon"><GraduationCap size={20} /></div><h3>No students match that search</h3><p>Try another name, year, or area of focus.</p></div>}</QueryState></div>;
}

export function FacultyPage() {
  const query = useGetFaculty();
  const faculty = query.data ?? [];
  return <div className="space-y-7"><PageIntro eyebrow="People / Faculty" title="The people behind the practice" description="Meet the faculty guiding research, teaching, and the next generation of systems thinkers."><span className="page-count">{faculty.length} faculty</span></PageIntro><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}>{faculty.length ? <div className="faculty-grid">{faculty.map((person) => <article className="faculty-card portal-card portal-card-hover" key={person.id} data-testid={`card-faculty-${person.id}`}><div className="faculty-card-top"><Avatar name={person.name} src={person.avatarUrl} size="lg" /><div className="ml-auto tag">{person.designation}</div></div><h3>{person.name}</h3><p className="mt-2 text-sm font-semibold text-accent">{person.specialization}</p><div className="faculty-meta"><p><Mail size={13} /> <a href={`mailto:${person.email}`} data-testid={`link-email-faculty-${person.id}`}>{person.email}</a></p><p><MapPin size={13} /> {person.office}</p></div></article>)}</div> : <div className="empty-state"><div className="empty-icon"><Users size={20} /></div><h3>Faculty directory is quiet</h3><p>There are no faculty profiles to display right now.</p></div>}</QueryState></div>;
}

export function EventsPage() {
  const [showPast, setShowPast] = useState(false);
  const query = useGetEvents({ upcoming: !showPast });
  const events = query.data ?? [];
  return <div className="space-y-7"><PageIntro eyebrow="Calendar / Department life" title="Events & calendar" description="The next lectures, reviews, workshops, and moments that bring the department together." children={<button className="button button-light" onClick={() => setShowPast((value) => !value)} data-testid="button-toggle-events">{showPast ? 'Show upcoming' : 'Show all events'}<CalendarDays size={15} /></button>} /><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}>{events.length ? <div className="event-list">{events.map((event) => <EventRow detailed key={event.id} event={event} />)}</div> : <div className="empty-state"><div className="empty-icon"><CalendarDays size={20} /></div><h3>The calendar is clear</h3><p>New department events will appear here when they are announced.</p></div>}</QueryState></div>;
}

export function NewsPage() {
  const query = useGetNews();
  const news = query.data ?? [];
  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...Array.from(new Set(news.map((item) => item.category)))], [news]);
  const filtered = category === 'All' ? news : news.filter((item) => item.category === category);
  return <div className="space-y-7"><PageIntro eyebrow="Signal / News & notices" title="What is happening here" description="Official updates, opportunities, and the small pieces of news that keep our community connected." /><div className="pill-row">{categories.map((item) => <button key={item} className={`filter-pill ${category === item ? 'filter-pill-active' : ''}`} onClick={() => setCategory(item)} data-testid={`button-news-category-${item.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{item}</button>)}</div><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}>{filtered.length ? <div className="news-grid">{filtered.map((item) => <NewsCard key={item.id} item={item} />)}</div> : <div className="empty-state"><div className="empty-icon"><Newspaper size={20} /></div><h3>No updates in this category</h3><p>Try viewing all department news.</p></div>}</QueryState></div>;
}

export function NotificationsPage() {
  const query = useGetNotifications();
  const notifications = query.data ?? [];
  return <div className="space-y-7"><PageIntro eyebrow="Inbox / Department signal" title="Notifications" description="A focused record of reminders, approvals, deadlines, and updates relevant to you." /><QueryState loading={query.isLoading} error={query.isError} onRetry={() => query.refetch()}>{notifications.length ? <div className="notification-list">{notifications.map((notification) => <article className={`notification-row ${!notification.read ? 'notification-unread' : ''}`} key={notification.id} data-testid={`card-notification-${notification.id}`}><div className={`notification-mark ${notification.read ? '' : 'notification-mark-unread'}`}><Bell size={16} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="tag">{notification.category}</span>{!notification.read && <span className="unread-label">Unread</span>}</div><h3>{notification.title}</h3><p>{notification.body}</p><div className="mt-3 flex items-center gap-1.5 font-mono-ui text-[10px] text-muted-foreground"><Clock3 size={12} />{formatDate(notification.createdAt, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</div></div></article>)}</div> : <div className="empty-state"><div className="empty-icon"><Bell size={20} /></div><h3>You are all caught up</h3><p>There are no notifications waiting for your attention.</p></div>}</QueryState></div>;
}

export function LoginPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: session } = useGetSession();
  const createSession = useCreateSession();
  const [email, setEmail] = useState('student@gec.ac.in');
  const [password, setPassword] = useState('cps2026');
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => { if (session?.authenticated) setLocation('/'); }, [session?.authenticated, setLocation]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    createSession.mutate({ data: { email, password } }, { onSuccess: (nextSession) => { queryClient.setQueryData(getGetSessionQueryKey(), nextSession); setLocation('/'); } });
  };
  return <div className="login-screen"><div className="login-aside texture-grid"><div className="login-aside-inner"><div className="brand-lockup"><div className="brand-mark"><span>CP</span><i /></div><div><p className="text-sm font-extrabold text-white">CPS Engineering</p><p className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-slate-400">GEC Thrissur</p></div></div><div className="mt-auto"><p className="kicker text-accent">A department in motion</p><h1>Where computation meets the physical world.</h1><p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">One trusted space for the people, plans, and signals shaping Cyber Physical Systems Engineering.</p><div className="login-aside-rule"><span>EST. 1989</span><span>THRISSUR, KERALA</span></div></div></div></div><div className="login-form-wrap"><div className="login-form-box"><div className="mobile-login-brand"><div className="brand-mark"><span>CP</span><i /></div><span>CPS Engineering</span></div><div className="mb-9"><p className="kicker mb-3 text-accent">Institutional access</p><h2>Welcome back.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to reach your department workspace.</p></div><form onSubmit={submit} className="space-y-5"><label className="field-label">Institutional email<input className="text-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@gec.ac.in" required data-testid="input-login-email" /></label><label className="field-label">Password<div className="password-wrap"><input className="text-input" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required data-testid="input-login-password" /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} data-testid="button-toggle-password">{showPassword ? 'Hide' : 'Show'}</button></div></label>{createSession.isError && <div className="form-error" data-testid="status-login-error"><CircleAlert size={15} />We could not verify those details. Please try again.</div>}<button className="button button-submit w-full" type="submit" disabled={createSession.isPending} data-testid="button-submit-login">{createSession.isPending ? 'Connecting…' : 'Enter department portal'}<ArrowRight size={16} /></button></form><div className="login-note"><ShieldCheck size={16} /><p>Access is reserved for the CPS Engineering community at GEC Thrissur.</p></div></div><p className="login-footer">Government Engineering College, Thrissur <span>/</span> Department of CPS Engineering</p></div></div>;
}

export function AuthLoading() {
  return <div className="auth-loading"><div className="brand-mark"><span>CP</span><i /></div><Skeleton className="mt-5 h-3 w-32" /><Skeleton className="mt-2 h-2 w-24" /></div>;
}