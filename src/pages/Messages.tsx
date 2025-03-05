
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { messagesData } from "@/data/dummyData";
import { Search, Send, Paperclip, Phone, Video, MoreHorizontal, Star, StarOff, UserPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Messages: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState(messagesData[0]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [starredContacts, setStarredContacts] = useState<number[]>([1, 3]);

  const toggleStar = (id: number) => {
    setStarredContacts(prev => 
      prev.includes(id) 
        ? prev.filter(contactId => contactId !== id) 
        : [...prev, id]
    );
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    
    // Just to simulate sending a message
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    });
    
    setMessageText("");
  };

  const filteredMessages = messagesData.filter(
    message => 
      message.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Communicate with your team and clients
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 h-[calc(100%-5rem)]"
        >
          {/* Contacts List */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="px-4 py-3 space-y-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Contacts</CardTitle>
                  <Button variant="ghost" size="icon">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search contacts..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <Tabs defaultValue="all" className="px-4">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="starred">Starred</TabsTrigger>
                </TabsList>
              </Tabs>
              <CardContent className="flex-1 overflow-hidden px-2 py-2">
                <ScrollArea className="h-full px-2">
                  <div className="space-y-1">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                          selectedMessage.id === message.id
                            ? "bg-muted"
                            : ""
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={message.sender.avatar} />
                          <AvatarFallback>
                            {message.sender.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="font-medium truncate">
                              {message.sender.name}
                            </p>
                            <div className="flex items-center">
                              {!message.read && (
                                <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                              )}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStar(message.id);
                                }} 
                                className="ml-2 text-muted-foreground hover:text-amber-400"
                              >
                                {starredContacts.includes(message.id) ? (
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                ) : (
                                  <StarOff className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {message.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Area */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b flex-none px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedMessage.sender.avatar} />
                      <AvatarFallback>
                        {selectedMessage.sender.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedMessage.sender.name}</CardTitle>
                      <CardDescription>{selectedMessage.sender.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-6">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        Today
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                        <p className="text-sm">{selectedMessage.message}</p>
                        <span className="text-xs text-muted-foreground">9:30 AM</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-[80%]">
                        <p className="text-sm">Thanks for reaching out. How can I help?</p>
                        <span className="text-xs text-primary-foreground/80">9:32 AM</span>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                        <p className="text-sm">I need some assistance with the payment processing system. It seems to be experiencing some delays.</p>
                        <span className="text-xs text-muted-foreground">9:35 AM</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-[80%]">
                        <p className="text-sm">I understand. Let me check the system status and get back to you shortly. Have you tried restarting the application?</p>
                        <span className="text-xs text-primary-foreground/80">9:37 AM</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t p-4 flex-none">
                <div className="flex items-center gap-2 w-full">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea
                    placeholder="Type your message..."
                    className="flex-1 min-h-10 max-h-32"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button size="icon" className="rounded-full" onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Messages;
