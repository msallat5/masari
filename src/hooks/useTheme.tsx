import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ThemeConfig } from 'antd';
import { lightTheme, darkTheme, LIGHT_THEME_COLORS, DARK_THEME_COLORS } from '../themes/themeConfig';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeConfig;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Check if user has previously set theme
  const storedTheme = localStorage.getItem('theme') as ThemeMode | null;
  // Check system preference if no stored theme
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const defaultTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  const [themeMode, setThemeMode] = useState<ThemeMode>(defaultTheme);
  
  // Apply theme based on current mode
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  
  // Apply theme values as CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = themeMode === 'dark' ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
    
    // Base colors
    root.style.setProperty('--color-primary', themeMode === 'dark' ? '#76ABAE' : '#76A9FA');
    root.style.setProperty('--bg-color', colors.backgroundColor);
    root.style.setProperty('--card-bg', colors.cardBackground);
    root.style.setProperty('--text-color', themeMode === 'dark' ? '#FFFFFF' : '#2C3E50');
    root.style.setProperty('--text-color-secondary', themeMode === 'dark' ? '#CCCCCC' : '#4A5568');
    root.style.setProperty('--border-color', colors.borderColor);
    
    // Shadows
    root.style.setProperty('--shadow-sm', themeMode === 'dark' 
      ? '0 1px 2px rgba(0, 0, 0, 0.2)' 
      : '0 1px 2px rgba(0, 0, 0, 0.03)');
    
    root.style.setProperty('--shadow-md', themeMode === 'dark' 
      ? '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 6px -1px rgba(0, 0, 0, 0.25)' 
      : '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 6px -1px rgba(0, 0, 0, 0.02)');
    
    root.style.setProperty('--shadow-lg', themeMode === 'dark' 
      ? '0 4px 12px rgba(0, 0, 0, 0.5)' 
      : '0 4px 12px rgba(0, 0, 0, 0.08)');
    
    // Hover states
    root.style.setProperty('--hover-bg', colors.hoverBackground);
    root.style.setProperty('--hover-color', themeMode === 'dark' ? '#FFFFFF' : '#2C3E50');
    
    // Status colors
    root.style.setProperty('--success-color', '#52c41a');
    root.style.setProperty('--warning-color', '#faad14');
    root.style.setProperty('--error-color', '#f5222d');
    root.style.setProperty('--info-color', themeMode === 'dark' ? '#76ABAE' : '#76A9FA');
    
    // Spacing and radius (these don't change with theme)
    root.style.setProperty('--radius-sm', '8px');
    root.style.setProperty('--radius-md', '12px');
    root.style.setProperty('--radius-lg', '16px');
    root.style.setProperty('--spacing-xs', '4px');
    root.style.setProperty('--spacing-sm', '8px');
    root.style.setProperty('--spacing-md', '16px');
    root.style.setProperty('--spacing-lg', '24px');
    root.style.setProperty('--spacing-xl', '32px');
  }, [themeMode]);
  
  // Save theme preference when it changes
  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);
  
  // Toggle between light and dark mode
  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 