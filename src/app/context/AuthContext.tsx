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
  login: (user: User, token?: string, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Auto-login if JWT exists
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'student' || payload.role === 'admin' || payload.role === 'researcher') {
          setUser({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role,
          });
        }
      } catch {
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = (userData: User, token?: string, remember: boolean = false) => {
    setUser(userData);
    if (token && remember) {
      localStorage.setItem('authToken', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
