import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'student' | 'admin' | 'researcher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentId?: string;
  course?: string;
  credits?: number;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return payload;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 🔐 Auto-login on app load
  useEffect(() => {
    const token =
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('authToken');

    if (!token) return;

    const paylo
