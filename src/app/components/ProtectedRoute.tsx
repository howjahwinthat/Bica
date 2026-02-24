import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '@/app/context/AuthContext'; // <-- use the hook

interface ProtectedRouteProps {
  role: 'student' | 'admin' | 'researcher';
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ role, children, redirectTo = '/' }: ProtectedRouteProps) {
  const { user } = useAuth(); // <-- use the hook, not the provider
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate token check on mount (optional: fetch user data from backend)
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user || user.role !== role) return <Navigate to={redirectTo} replace />;

  return <>{children}</>;
}
