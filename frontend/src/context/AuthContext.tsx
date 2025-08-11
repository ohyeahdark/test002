import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister, fetchMe, logout as apiLogout} from '../features/auth/authAPI';

interface Employee {
  id: number;
  name: string;
  email: string;
  avatar?: string;
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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await fetchMe();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiLogin(username, password);
      const newToken = res.accessToken;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

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

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login: handleLogin, register: handleRegister, logout }}>
      {loading ? <div className="h-screen flex items-center justify-center">Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
