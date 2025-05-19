import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the current page key from the path
  const currentPage = location.pathname === '/' ? 'dashboard' : location.pathname.slice(1);
  
  // Handle menu item clicks
  const handleMenuClick = useCallback((key: string) => {
    const path = key === 'dashboard' ? '/' : `/${key}`;
    navigate(path);
  }, [navigate]);
  
  return {
    currentPage,
    handleMenuClick
  };
}; 