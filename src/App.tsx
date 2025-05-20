// src/App.tsx

import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import routes from './routes';
import './utils/i18n'; // your i18n setup
import { useEffect, useMemo } from 'react';

const AppContent: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const { direction, language } = useLanguage();

  // Sync <html> attributes and data-theme
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    document.documentElement.setAttribute('data-theme', themeMode);
    document.body.setAttribute('data-theme', themeMode);
  }, [direction, language, themeMode]);

  // Merge in Cairo as the fontFamily token
  const antTheme = useMemo(() => ({
    ...theme,
    token: {
      ...theme.token,
      fontFamily: "'Cairo', sans-serif",
    },
  }), [theme]);

  // Create router with basename for GitHub Pages deployment
  const router = createBrowserRouter(routes, {
    basename: import.meta.env.BASE_URL // This uses the base value from vite.config.ts
  });

  // Log the router's basename to help with debugging
  console.log('Router basename:', import.meta.env.BASE_URL);

  return (
    <ConfigProvider theme={antTheme} direction={direction}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};


const App: React.FC = () => (
  <ThemeProvider>
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
