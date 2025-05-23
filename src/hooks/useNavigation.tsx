// src/hooks/useNavigation.ts

import { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook to derive the current page key from the URL
 * and provide a handler for menu-driven navigation.
 */
export function useNavigation() {
  // React Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Compute a "page key" from the current path:
   * - "/"              → "dashboard"
   * - "/applications"  → "applications"
   * - etc.
   */
  const currentPage = useMemo<string>(() => {
    return location.pathname === '/' ? 'dashboard' : location.pathname.slice(1);
  }, [location.pathname]);

  /**
   * Navigate to the route corresponding to a menu key.
   * - "dashboard" → "/"
   * - any other  → "/<key>"
   */
  const handleMenuClick = useCallback(
    (key: string) => {
      const path = key === 'dashboard' ? '/' : `/${key}`;
      navigate(path);
    },
    [navigate],
  );

  return { currentPage, handleMenuClick };
}
