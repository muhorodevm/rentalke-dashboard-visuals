
import React, { useState } from 'react';
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
import { cn } from '@/lib/utils';

interface TopbarProps {
  isSidebarCollapsed: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ isSidebarCollapsed }) => {
  const { theme, toggleTheme } = useTheme();
  const [unreadNotifications, setUnreadNotifications] = useState(
    notificationsData.filter(n => !n.read).length
  );
  
  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };
  
  return (
    <header
      className={cn(
        "sticky top-0 z-20 w-full h-16 bg-background border-b px-5",
        "transition-all duration-300",
        isSidebarCollapsed ? "ml-20" : "ml-[260px]"
      )}
    >
      <div className="h-full flex items-center justify-between">
        {/* Left section - Header title */}
        <div>
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>
        
        {/* Right section - actions and profile */}
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
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
          
          {/* Messages */}
          <Button variant="ghost" size="icon" className="topbar-icon-btn" asChild>
            <a href="/messages">
              <MessageSquare size={18} />
            </a>
          </Button>
          
          {/* Notifications dropdown */}
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
            <DropdownMenuContent align="end" className="w-80">
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
                          <span className="w-2 h-2 rounded-full bg-rentalke-blue" />
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
                <a 
                  href="/notifications" 
                  className="justify-center text-sm text-center py-1.5 cursor-pointer"
                >
                  View all notifications
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 pl-3 pr-0 overflow-hidden" size="sm">
                <span className="mr-2 hidden sm:inline-block">{userProfile.name}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback>
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userProfile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {userProfile.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
