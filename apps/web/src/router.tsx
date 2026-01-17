import { createRouter, createRootRoute, createRoute, Navigate } from '@tanstack/react-router';
import { RootComponent } from '@/components/RootComponent';
import { LoginPage } from '@/pages/LoginPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useAuth } from '@/contexts/AuthContext';

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

// Index route - redirects based on auth state
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
});

function IndexComponent() {
  const { token } = useAuth();
  
  if (token) {
    return <Navigate to="/dashboard" />;
  }
  
  return <Navigate to="/login" />;
}

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardWrapper,
});

function DashboardWrapper() {
  const { user } = useAuth();

  // Route to role-specific dashboards
  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" />;
    case 'DOCTOR':
      return <Navigate to="/doctor/dashboard" />;
    case 'FRONTDESK':
      return <Navigate to="/frontdesk/dashboard" />;
    case 'PATIENT':
      return <Navigate to="/patient/dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
}

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: AdminDashboard,
});

const unauthorizedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/unauthorized',
  component: UnauthorizedPage,
});

const patientAppointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient/appointments',
  component: () => <div className="p-8">Patient Appointments - Coming Soon</div>,
});

const patientRecordsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient/records',
  component: () => <div className="p-8">Patient Medical Records - Coming Soon</div>,
});

const patientBillingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient/billing',
  component: () => <div className="p-8">Patient Billing - Coming Soon</div>,
});

const doctorScheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doctor/schedule',
  component: () => <div className="p-8">Doctor Schedule - Coming Soon</div>,
});

const doctorPatientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doctor/patients',
  component: () => <div className="p-8">Doctor Patients - Coming Soon</div>,
});

const doctorProceduresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doctor/procedures',
  component: () => <div className="p-8">Doctor Procedures - Coming Soon</div>,
});

const frontdeskAppointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/frontdesk/appointments',
  component: () => <div className="p-8">Frontdesk Appointments - Coming Soon</div>,
});

const frontdeskCheckinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/frontdesk/checkin',
  component: () => <div className="p-8">Frontdesk Check-in - Coming Soon</div>,
});

const frontdeskPatientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/frontdesk/patients',
  component: () => <div className="p-8">Frontdesk Patients - Coming Soon</div>,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: () => <div className="p-8">Admin Users - Coming Soon</div>,
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/analytics',
  component: () => <div className="p-8">Admin Analytics - Coming Soon</div>,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/settings',
  component: () => <div className="p-8">Admin Settings - Coming Soon</div>,
});

const adminLogsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/logs',
  component: () => <div className="p-8">Admin Audit Logs - Coming Soon</div>,
});

const adminReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/reports',
  component: () => <div className="p-8">Admin Reports - Coming Soon</div>,
});

const adminBackupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/backup',
  component: () => <div className="p-8">Admin Backup - Coming Soon</div>,
});

// Role-specific dashboard routes
const patientDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient/dashboard',
  component: () => <div className="p-8">Patient Dashboard - Coming Soon</div>,
});

const doctorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doctor/dashboard',
  component: () => <div className="p-8">Doctor Dashboard - Coming Soon</div>,
});

const frontdeskDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/frontdesk/dashboard',
  component: () => <div className="p-8">Frontdesk Dashboard - Coming Soon</div>,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  dashboardRoute,
  adminDashboardRoute,
  patientDashboardRoute,
  doctorDashboardRoute,
  frontdeskDashboardRoute,
  unauthorizedRoute,
  patientAppointmentsRoute,
  patientRecordsRoute,
  patientBillingRoute,
  doctorScheduleRoute,
  doctorPatientsRoute,
  doctorProceduresRoute,
  frontdeskAppointmentsRoute,
  frontdeskCheckinRoute,
  frontdeskPatientsRoute,
  adminUsersRoute,
  adminAnalyticsRoute,
  adminSettingsRoute,
  adminLogsRoute,
  adminReportsRoute,
  adminBackupRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
