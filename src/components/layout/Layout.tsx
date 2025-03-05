
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AnimatePresence, motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
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
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <div 
        className={cn(
          "min-h-screen transition-all duration-300",
          isSidebarCollapsed ? "ml-20" : "ml-[260px]"
        )}
      >
        <Topbar isSidebarCollapsed={isSidebarCollapsed} />
        
        <main className="px-6 py-6">
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
