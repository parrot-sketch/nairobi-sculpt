import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  if (!token || !user) {
    navigate({ to: '/login' });
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    navigate({ to: '/unauthorized' });
    return null;
  }

  return <>{children}</>;
};
