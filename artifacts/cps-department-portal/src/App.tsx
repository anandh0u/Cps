import { type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useGetSession } from '@workspace/api-client-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  AuthLoading,
  DashboardPage,
  EventsPage,
  FacultyPage,
  LoginPage,
  NewsPage,
  NotificationsPage,
  PortalLayout,
  StudentsPage,
} from '@/components/portal';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  const [location, setLocation] = useLocation();
  const sessionQuery = useGetSession({ query: { queryKey: ['/api/auth/session'] } });
  const isLogin = location === '/login';

  useEffect(() => {
    if (!sessionQuery.isLoading && !sessionQuery.data?.authenticated && !isLogin) setLocation('/login');
  }, [sessionQuery.data?.authenticated, sessionQuery.isLoading, isLogin, setLocation]);

  if (isLogin) return <LoginPage />;
  if (sessionQuery.isLoading) return <AuthLoading />;
  if (!sessionQuery.data?.authenticated) return <AuthLoading />;

  return (
    <PortalLayout>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={DashboardPage} />
          <Route path="/students" component={StudentsPage} />
          <Route path="/faculty" component={FacultyPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/news" component={NewsPage} />
          <Route path="/notifications" component={NotificationsPage} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </PortalLayout>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;