import React, { useEffect, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Global providers for theme and language
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';

// App routes and i18n setup
import routes from './routes';
import './utils/i18n'; 

/**
 * The inside of the app once theme & language are available.
 * - Syncs HTML attributes for direction, language, and data-theme
 * - Merges in the custom font into Ant Design's theme tokens
 * - Sets up the React Router with the correct basename
 */
const AppContent: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const { direction, language } = useLanguage();

  // Sync document <html> attributes and data-theme on changes
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    document.documentElement.setAttribute('data-theme', themeMode);
    document.body.setAttribute('data-theme', themeMode);
  }, [direction, language, themeMode]);

  // Extend the Ant theme to always use the Cairo font
  const antTheme = useMemo(
    () => ({
      ...theme,
      token: {
        ...theme.token,
        fontFamily: "'Cairo', sans-serif",
      },
    }),
    [theme]
  );

  // Create the router once, using Vite's BASE_URL for deployments
  const router = useMemo(
    () =>
      createBrowserRouter(routes, {
        basename: import.meta.env.BASE_URL,
      }),
    []
  );
  
  return (
    <ConfigProvider theme={antTheme} direction={direction}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

/**
 * Root of the application.
 * Wraps AppContent in ThemeProvider and LanguageProvider so that
 * hooks inside AppContent can access theme & language.
 */
const App: React.FC = () => (
  <ThemeProvider>
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
