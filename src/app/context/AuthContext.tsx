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

// 🔐 Decode JWT safely
function decodeToken(token: string): User | null {
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    const payload = JSON.parse(
      atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
    );
    return payload as User;
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // ✅ Check both localStorage and sessionStorage
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded) {
        setUser(decoded);
        console.log('AuthProvider loaded user from token:', decoded);
      }
    }
  }, []);

  const login = (user: User, token: string, remember = false) => {
    setUser(user);
    if (remember) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
    console.log('User logged in:', user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔥 Hook for accessing AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
