import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { User, ApiResponse } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<ApiResponse<any>>;
  register: (data: any) => Promise<ApiResponse<any>>;
  logout: () => void;
  verifyMfa: (token: string, userId?: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('ciphernet_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.auth.me();
      setUser(res.data.user);
    } catch (error) {
      console.error("Auth check failed", error);
      localStorage.removeItem('ciphernet_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      const res = await api.auth.login(credentials);
      if (res.status === 'success' && res.token) {
        localStorage.setItem('ciphernet_token', res.token);
        setUser(res.data.user);
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  const verifyMfa = async (otp: string, userId?: string) => {
    try {
      const res = await api.auth.verifyMfa({ token: otp, userId });
      if (res.status === 'success' && res.token) {
        localStorage.setItem('ciphernet_token', res.token);
        await checkAuth();
      }
    } catch (error) {
      throw error;
    }
  }

  const register = async (data: any) => {
    return api.auth.register(data);
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      // Ignore logout errors
    }
    localStorage.removeItem('ciphernet_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, verifyMfa, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
