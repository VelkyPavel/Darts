import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

export type Theme = 'liquidGlassLight' | 'liquidGlassDark' | 'normalLight' | 'normalDark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'normalDark',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    loadFromStorage(STORAGE_KEYS.THEME, 'normalDark' as Theme)
  );

  const setTheme = (t: Theme) => {
    setThemeState(t);
    saveToStorage(STORAGE_KEYS.THEME, t);
  };

  // Apply theme class to document root immediately - prevents flash
  useEffect(() => {
    const root = document.documentElement;
    root.className = `theme-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
