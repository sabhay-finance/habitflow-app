import { useState, useEffect } from 'react';
import type { UserSettings } from '../types';

export function useTheme(settings: UserSettings, updateSettings: (newSettings: Partial<UserSettings>) => void) {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let activeIsDark = false;
      if (settings.theme === 'dark') {
        activeIsDark = true;
      } else if (settings.theme === 'light') {
        activeIsDark = false;
      } else {
        // System
        activeIsDark = mediaQuery.matches;
      }

      setIsDark(activeIsDark);
      if (activeIsDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const listener = () => {
      if (settings.theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [settings.theme]);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  return { isDark, toggleTheme, theme: settings.theme };
}
