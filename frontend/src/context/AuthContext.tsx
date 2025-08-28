import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister, fetchMe, logout as apiLogout } from '../features/auth/authAPI';

interface Employee {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  department?: { name: string };
  position?: { name: string };
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  refreshMe: () => Promise<void>;
}

interface User {
  id: number;
  username: string;
  role: string;
  employee?: Employee;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshMe = useCallback(async () => {
    try {
      const me = await fetchMe(); // server đọc cookie → trả user
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe(); // chạy 1 lần khi app mount
  }, [refreshMe]);

  const login = useCallback(async (username: string, password: string) => {
    await apiLogin(username, password); // server set cookie
    await refreshMe(); // cập nhật user
  }, [refreshMe]);

  const handleRegister = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiRegister(username, password);
      const newToken = res.accessToken;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register: handleRegister, logout, refreshMe }}>
      {loading ? <div className="h-screen flex items-center justify-center">Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
