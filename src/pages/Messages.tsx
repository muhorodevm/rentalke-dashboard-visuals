
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Search, Send, ArrowUpRight, PaperclipIcon } from 'lucide-react';
import { messagesData } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(messagesData[0]);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState(messagesData);
  const { toast } = useToast();
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // In a real app, this would send to an API
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    });
    
    setMessageText('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Message Center</h1>
        <p className="text-muted-foreground mt-1">
          Communicate with your team and managers
        </p>
      </div>
      
      <motion.div
        className="grid md:grid-cols-[350px_1fr] gap-6 h-[calc(100vh-180px)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Conversations list */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="px-4 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Conversations</CardTitle>
                <Badge variant="outline">{conversations.length}</Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <Tabs defaultValue="all" className="px-4">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                <TabsTrigger value="important" className="flex-1">Important</TabsTrigger>
              </TabsList>
            </Tabs>
            <CardContent className="flex-1 overflow-y-auto p-0 pt-3">
              <div className="px-2 space-y-0.5">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-colors",
                      activeConversation.id === conversation.id 
                        ? "bg-primary/5 border-l-2 border-primary" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={conversation.sender.avatar} />
                        <AvatarFallback>
                          {conversation.sender.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className={cn(
                            "font-medium truncate",
                            !conversation.read && "font-semibold"
                          )}>
                            {conversation.sender.name}
                          </p>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {conversation.time}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.sender.role}
                        </p>
                        <p className="text-sm truncate mt-1">
                          {conversation.message}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Active conversation */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="py-4 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={activeConversation.sender.avatar} />
                    <AvatarFallback>
                      {activeConversation.sender.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {activeConversation.sender.name}
                    </CardTitle>
                    <CardDescription>
                      {activeConversation.sender.role}
                    </CardDescription>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto py-4">
              <div className="space-y-6">
                {/* Message bubbles would go here */}
                <div className="flex items-start gap-3">
                  <Avatar className="mt-1">
                    <AvatarImage src={activeConversation.sender.avatar} />
                    <AvatarFallback>
                      {activeConversation.sender.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[85%]">
                    <div className="bg-muted p-3 rounded-lg">
                      <p>{activeConversation.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activeConversation.time}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <div className="p-4 border-t">
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="rounded-full">
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pr-14"
                  />
                  <Button 
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Messages;
