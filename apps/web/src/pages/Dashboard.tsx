import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PatientDashboard } from '@/pages/PatientDashboard';
import { DoctorDashboard } from '@/pages/DoctorDashboard';
import { FrontdeskDashboard } from '@/pages/FrontdeskDashboard';
import { AdminDashboard } from '@/pages/AdminDashboard';

export const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'PATIENT':
        return (
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        );
      case 'DOCTOR':
        return (
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorDashboard />
          </ProtectedRoute>
        );
      case 'FRONTDESK':
        return (
          <ProtectedRoute allowedRoles={['FRONTDESK']}>
            <FrontdeskDashboard />
          </ProtectedRoute>
        );
      case 'ADMIN':
        return (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        );
      default:
        return <div>Unknown role</div>;
    }
  };

  return renderDashboard();
};
