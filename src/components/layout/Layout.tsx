
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AnimatePresence, motion } from 'framer-motion';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Use the scroll to top hook
  useScrollToTop();
  
  // Check if screen is mobile size
  const isMobile = () => window.innerWidth < 768;
  
  // Initialize sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) {
        setIsSidebarCollapsed(true);
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    if (isMobile()) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
      setIsSidebarOpen(true);
    }
  };
  
  // Close sidebar when clicking a link on mobile
  useEffect(() => {
    if (isMobile()) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);
  
  // Get page title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/analytics':
        return 'Analytics';
      case '/messages':
        return 'Messages';
      case '/users':
        return 'Users';
      case '/payments':
        return 'Payments';
      case '/settings':
        return 'Settings';
      case '/notifications':
        return 'Notifications';
      case '/user-management':
        return 'User Management';
      default:
        return 'Dashboard';
    }
  };
  
  // Update document title
  useEffect(() => {
    document.title = `RentalKE - ${getPageTitle()}`;
  }, [location]);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile menu button - only visible on small screens */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="bg-background/80 backdrop-blur"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Overlay for mobile - only visible when sidebar is open on mobile */}
      {isMobile() && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar}
        isMobile={isMobile()}
        isOpen={isSidebarOpen}
      />
      
      <div 
        className={cn(
          "min-h-screen transition-all duration-300",
          isMobile() 
            ? "ml-0" 
            : (isSidebarCollapsed ? "ml-20" : "ml-[260px]")
        )}
      >
        <Topbar isSidebarCollapsed={isSidebarCollapsed} />
        
        <main className="px-4 sm:px-6 py-6 mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut"
              }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Layout;
