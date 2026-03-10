// src/app/components/ProtectedRoute.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";

interface ProtectedRouteProps {
  role: string;
  children: ReactNode;
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user || user.role !== role) {
    // redirect to role-specific login if not authenticated
    return <Navigate to={`/${role}/login`} replace />;
  }

  return <>{children}</>; // render wrapped component
}