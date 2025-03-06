
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, LogOut, 
  HelpCircle, Home, BarChart3, MessageSquare,
  Settings, Bell, Users, User, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const { toast } = useToast();
  const { logout } = useAuth();
  
  
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'User Management', path: '/user-management', icon: Users },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];
  
  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been logged out successfully.",
    });
    logout(); // Call the logout function from the context
    
  };
  
  const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 80 }
  };
  
  return (
    <motion.aside
      className="fixed left-0 top-0 bottom-0 h-screen bg-sidebar z-40 border-r"
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full">
        {/* Logo and toggle button */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-rentalke-blue flex items-center justify-center text-white font-semibold">
                RK
              </div>
            </div>
            {!isCollapsed && (
              <motion.h1 
                className="ml-3 text-xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                RentalKE
              </motion.h1>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle-btn"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <ul className="space-y-1.5">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "sidebar-item",
                      isActive && "active"
                    )}
                  >
                    <item.icon size={20} />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer actions */}
        <div className="p-3 mt-auto border-t">
          <div className="space-y-1.5">
            <Link to="/help" className="sidebar-item">
              <HelpCircle size={20} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Help & Support
                </motion.span>
              )}
            </Link>
            <Link to="/login" className="sidebar-item w-full text-left">
              <LogOut size={20} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
