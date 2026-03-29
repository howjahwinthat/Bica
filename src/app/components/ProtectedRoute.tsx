// ProtectedRoute.tsx - use isLoading from context
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';

interface ProtectedRouteProps {
  role: 'student' | 'admin' | 'researcher';
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ role, children, redirectTo = '/student/login' }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user || user.role !== role) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
}
