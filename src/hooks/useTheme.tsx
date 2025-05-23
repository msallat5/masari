import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ThemeConfig } from 'antd';
import {
  lightTheme,
  darkTheme,
  LIGHT_THEME_COLORS,
  DARK_THEME_COLORS,
} from '../themes/themeConfig';

/** Allowed theme modes */
type ThemeMode = 'light' | 'dark';

/** Shape of the ThemeContext value */
interface ThemeContextType {
  /** Ant Design theme configuration object */
  theme: ThemeConfig;
  /** Current mode ('light' or 'dark') */
  themeMode: ThemeMode;
  /** Switch between light and dark */
  toggleTheme: () => void;
}

/** React context for theme (undefined if used outside provider) */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Props for the ThemeProvider component */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider:
 * - Initializes from localStorage or system preference
 * - Persists changes in localStorage
 * - Applies CSS variables on <html> for custom styling
 * - Exposes AntD theme config + toggle helper via context
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // 1. Load saved theme or detect system preference
  const storedTheme = localStorage.getItem('theme') as ThemeMode | null;
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialMode: ThemeMode =
    storedTheme ?? (prefersDark ? 'dark' : 'light');

  // 2. State: current theme mode
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialMode);

  // 3. Pick AntD theme config
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  /**
   * 4. Apply CSS variables whenever themeMode changes
   *    (for custom colors, shadows, spacing, etc.)
   */
  useEffect(() => {
    const root = document.documentElement;
    const colors =
      themeMode === 'dark' ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;

    // -- Core colors
    root.style.setProperty(
      '--color-primary',
      themeMode === 'dark' ? '#76ABAE' : '#76A9FA'
    );
    root.style.setProperty('--bg-color', colors.backgroundColor);
    root.style.setProperty('--card-bg', colors.cardBackground);
    root.style.setProperty(
      '--text-color',
      themeMode === 'dark' ? '#FFFFFF' : '#2C3E50'
    );
    root.style.setProperty(
      '--text-color-secondary',
      themeMode === 'dark' ? '#CCCCCC' : '#4A5568'
    );
    root.style.setProperty('--border-color', colors.borderColor);

    // -- Shadows
    root.style.setProperty(
      '--shadow-sm',
      themeMode === 'dark'
        ? '0 1px 2px rgba(0,0,0,0.2)'
        : '0 1px 2px rgba(0,0,0,0.03)'
    );
    root.style.setProperty(
      '--shadow-md',
      themeMode === 'dark'
        ? '0 1px 3px rgba(0,0,0,0.3),0 1px 6px -1px rgba(0,0,0,0.25)'
        : '0 1px 3px rgba(0,0,0,0.05),0 1px 6px -1px rgba(0,0,0,0.02)'
    );
    root.style.setProperty(
      '--shadow-lg',
      themeMode === 'dark'
        ? '0 4px 12px rgba(0,0,0,0.5)'
        : '0 4px 12px rgba(0,0,0,0.08)'
    );

    // -- Hover states
    root.style.setProperty('--hover-bg', colors.hoverBackground);
    root.style.setProperty(
      '--hover-color',
      themeMode === 'dark' ? '#FFFFFF' : '#2C3E50'
    );

    // -- Status colors (static)
    root.style.setProperty('--success-color', '#52c41a');
    root.style.setProperty('--warning-color', '#faad14');
    root.style.setProperty('--error-color', '#f5222d');
    root.style.setProperty(
      '--info-color',
      themeMode === 'dark' ? '#76ABAE' : '#76A9FA'
    );

    // -- Spacing & radii
    root.style.setProperty('--radius-sm', '8px');
    root.style.setProperty('--radius-md', '12px');
    root.style.setProperty('--radius-lg', '16px');
    root.style.setProperty('--spacing-xs', '4px');
    root.style.setProperty('--spacing-sm', '8px');
    root.style.setProperty('--spacing-md', '16px');
    root.style.setProperty('--spacing-lg', '24px');
    root.style.setProperty('--spacing-xl', '32px');
  }, [themeMode]);

  /**
   * 5. Persist theme preference whenever mode changes
   */
  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  /** 6. Toggle between light and dark modes */
  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to consume ThemeContext.
 * Throws an error if used outside of ThemeProvider.
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
