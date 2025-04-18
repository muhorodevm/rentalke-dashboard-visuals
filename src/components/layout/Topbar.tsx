import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Moon, Sun, MessageSquare } from 'lucide-react';
import { userProfile, notificationsData } from '@/data/dummyData';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { log } from 'console';

interface TopbarProps {
  isSidebarCollapsed: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ isSidebarCollapsed }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  const { logout } = useAuth();
  const { user } = useAuth();
  // console.log(user);
  

  const [unreadNotifications, setUnreadNotifications] = useState(
    notificationsData.filter(n => !n.read).length
  );
  
  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.startsWith('/user-management/')) {
      return 'User Details';
    }
    
    if (path.startsWith('/properties/') && path !== '/properties') {
      return 'Property Details';
    }
    
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/analytics':
        return 'Analytics';
      case '/messages':
        return 'Messages';
      case '/properties':
        return 'Properties';
      case '/user-management':
        return 'User Management';
      case '/payments':
        return 'Payments';
      case '/profile':
        return 'Profile';
      case '/settings':
        return 'Settings';
      case '/notifications':
        return 'Notifications';
      default:
        return 'Dashboard';
    }
  };
  
  const isMobile = window.innerWidth < 768;
  
  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-background border-b px-4 sm:px-5",
        "transition-all duration-300",
        isMobile ? "left-0" : (isSidebarCollapsed ? "left-20" : "left-[260px]")
      )}
    >
      <div className="h-full flex items-center justify-between">
        <div className={cn(isMobile && "ml-12")}>
          <h2 className="text-lg sm:text-xl font-semibold">{getPageTitle()}</h2>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="topbar-icon-btn"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </motion.div>
            </AnimatePresence>
          </Button>
          
          <Button variant="ghost" size="icon" className="topbar-icon-btn hidden xs:flex" asChild>
            <Link to="/messages">
              <MessageSquare size={18} />
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="topbar-icon-btn">
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <span className="notifications-badge">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] sm:w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadNotifications > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs h-auto py-1 px-2"
                  >
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-72 overflow-y-auto py-1">
                {notificationsData.length === 0 ? (
                  <div className="py-4 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notificationsData.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2 px-4 focus:bg-muted/50">
                      <div className="flex justify-between w-full">
                        <p className="font-medium">{notification.title}</p>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link 
                  to="/notifications" 
                  className="justify-center text-sm text-center py-1.5 cursor-pointer"
                >
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 pl-2 pr-0 overflow-hidden sm:pl-3" size="sm">
                <span className="mr-2 hidden sm:inline-block">{user?.name?.split(' ')[0]}</span>
                <Avatar className="h-8 w-8">
                  {user.profileImage ? (
                    <AvatarImage src={user?.profileImage} alt={user?.name || ""} />
                  ) : (
                    <AvatarFallback>
                      {user?.name?.substring(0, 2).toUpperCase() || ""}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div> 
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/login" onClick={logout}>Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
