import type { RouteObject } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ApplicationDetail from './pages/ApplicationDetail';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
  },
  {
    path: '/applications',
    element: (
      <Layout>
        <Applications />
      </Layout>
    ),
  },
  {
    path: '/applications/:id',
    element: (
      <Layout>
        <ApplicationDetail />
      </Layout>
    ),
  },
  {
    path: '/calendar',
    element: (
      <Layout>
        <Calendar />
      </Layout>
    ),
  },
  {
    path: '/settings',
    element: (
      <Layout>
        <Settings />
      </Layout>
    ),
  },
];

export default routes;