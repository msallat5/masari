import type { RouteObject } from 'react-router-dom';

// Layout wrapper that provides sidebar, header, theming, etc.
import Layout from './components/Layout';

// Page components
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ApplicationDetail from './pages/ApplicationDetail';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';

/**
 * Application routes configuration.
 * Each route is wrapped in the main <Layout> component
 * to ensure consistent navigation and styling.
 */
const routes: RouteObject[] = [
  {
    // Dashboard at the root path
    path: '/',
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
  },
  {
    // List of all applications
    path: '/applications',
    element: (
      <Layout>
        <Applications />
      </Layout>
    ),
  },
  {
    // Detail view for a single application
    path: '/applications/:id',
    element: (
      <Layout>
        <ApplicationDetail />
      </Layout>
    ),
  },
  {
    // Calendar view showing scheduled events
    path: '/calendar',
    element: (
      <Layout>
        <Calendar />
      </Layout>
    ),
  },
  {
    // Settings page for theme/language/preferences
    path: '/settings',
    element: (
      <Layout>
        <Settings />
      </Layout>
    ),
  },
];

export default routes;
