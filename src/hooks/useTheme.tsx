import { useTheme as useNextTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'twlight';

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const currentTheme = resolvedTheme || 'light';
    const themes: ThemeMode[] = ['light', 'dark', 'twlight'];
    const currentIndex = themes.indexOf(currentTheme as ThemeMode);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(mode);
  };

  return {
    theme,
    setTheme: setThemeMode,
    resolvedTheme,
    mounted,
    cycleTheme,
    isLight: resolvedTheme === 'light',
    isDark: resolvedTheme === 'dark',
    isTwlight: resolvedTheme === 'twlight',
  };
}; 