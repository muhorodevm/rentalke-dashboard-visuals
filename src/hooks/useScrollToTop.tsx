
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A hook that scrolls the window to the top when the route changes
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
};
