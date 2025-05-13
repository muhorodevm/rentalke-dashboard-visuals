
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A hook that scrolls the window to the top when the route changes
 * Also helps with restoring browser history state properly
 */
export const useScrollToTop = () => {
  const { pathname, key } = useLocation();

  useEffect(() => {
    // Smooth scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Add a history entry to ensure browser back button works correctly
    if (window.history && window.history.state) {
      window.history.replaceState(
        { 
          ...window.history.state, 
          __scroll: { x: 0, y: 0 },
          key
        },
        document.title
      );
    }
  }, [pathname, key]);
  
  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      // Force a small delay to ensure the browser has time to restore the scroll position
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, 10);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
};
