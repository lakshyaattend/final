import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Teacher, AuthContextType } from '../types';
import { authenticateTeacher } from '../utils/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);

  const login = async (loginId: string, password: string): Promise<boolean> => {
    try {
      const teacher = await authenticateTeacher(loginId, password);
      if (teacher) {
        setCurrentTeacher(teacher);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentTeacher(null);
  };

  const value = {
    currentTeacher,
    isAuthenticated: !!currentTeacher,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}