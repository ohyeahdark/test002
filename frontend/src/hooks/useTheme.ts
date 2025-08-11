import { useEffect, useState } from 'react';

export type ThemeType = 'light' | 'dark';

export function useThemeBase() {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    if (typeof window === 'undefined') return 'light';

    const stored = localStorage.getItem('theme') as ThemeType | null;
    if (stored === 'light' || stored === 'dark') return stored;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return {
    theme,
    isDark,
    setTheme: (t: ThemeType) => setThemeState(t),
    toggleTheme: () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light')),
    setThemeState,
  };
}
