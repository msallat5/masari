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

  const router = createBrowserRouter(routes);

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
