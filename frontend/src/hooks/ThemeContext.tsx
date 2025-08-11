import React, { createContext, useContext, useEffect } from 'react';
import { ThemeType, useThemeBase } from '../hooks/useTheme';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  setTheme: (t: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, isDark, setTheme, toggleTheme, setThemeState } = useThemeBase();

  // Đồng bộ theme giữa các tab
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
        setThemeState(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [setThemeState]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook sử dụng ở mọi nơi
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
