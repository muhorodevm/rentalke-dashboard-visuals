
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { messagesData } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

const MessageCenter: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3
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
            <CardTitle className="text-base font-bold">Messages</CardTitle>
            <CardDescription>Recent messages from your team</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8" asChild>
            <a href="/messages">View All</a>
          </Button>
        </CardHeader>
        <CardContent>
          <motion.div
            className="space-y-4"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {messagesData.slice(0, 3).map((message) => (
              <motion.div
                key={message.id}
                variants={itemVariants}
                className={cn(
                  "flex gap-3 p-3 rounded-lg transition-colors",
                  !message.read ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={message.sender.avatar} />
                  <AvatarFallback>
                    {message.sender.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-medium truncate">
                      {message.sender.name}
                    </p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {message.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {message.sender.role}
                  </p>
                  <p className="text-sm line-clamp-2">
                    {message.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MessageCenter;
