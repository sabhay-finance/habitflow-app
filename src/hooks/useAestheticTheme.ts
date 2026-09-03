import { useState, useCallback } from 'react';
import { AESTHETIC_THEMES, type AestheticTheme } from '../constants/flocusThemes';
import type { UserSettings } from '../types';

const STORAGE_KEY = 'habitflow_aesthetic_theme';

export function useAestheticTheme(
  settings: UserSettings,
  updateSettings: (newSettings: Partial<UserSettings>) => void
) {
  const [themeId, setThemeId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || settings.aestheticTheme;
    const exists = AESTHETIC_THEMES.some((t) => t.id === saved);
    return exists && saved ? saved : 'gothic_cathedral'; // Default to Gothic Cathedral as requested!
  });

  const activeTheme: AestheticTheme =
    AESTHETIC_THEMES.find((t) => t.id === themeId) || AESTHETIC_THEMES[0];

  const setTheme = useCallback(
    (newThemeId: string) => {
      const exists = AESTHETIC_THEMES.some((t) => t.id === newThemeId);
      if (exists) {
        setThemeId(newThemeId);
        localStorage.setItem(STORAGE_KEY, newThemeId);
        updateSettings({ aestheticTheme: newThemeId });
      }
    },
    [updateSettings]
  );

  return {
    themeId,
    activeTheme,
    setTheme,
    allThemes: AESTHETIC_THEMES,
  };
}
