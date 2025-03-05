
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notificationsData } from '@/data/dummyData';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const NotificationsPanel: React.FC = () => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-rentalke-green flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-rentalke-blue flex-shrink-0" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };
  
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="text-base font-bold">Recent Notifications</CardTitle>
            <CardDescription>System updates and alerts</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <motion.div
            className="space-y-4"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {notificationsData.slice(0, 4).map((notification) => (
              <motion.div
                key={notification.id}
                variants={itemVariants}
                className={cn(
                  "flex gap-3 p-3 rounded-lg transition-colors",
                  !notification.read ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <div className="mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationsPanel;
