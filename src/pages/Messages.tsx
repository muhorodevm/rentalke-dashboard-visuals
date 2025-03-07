import React, { useState, useEffect, useRef } from "react";
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
import { messagesData } from "@/data/dummyData"; // Keeping as fallback
import { 
  Search, 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  MoreHorizontal, 
  Star, 
  StarOff, 
  UserPlus,
  Loader2
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { initializeSocket, sendMessage, markMessageAsRead, sendTypingStatus } from "@/utils/socket";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

// Define message type to match backend
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
}

// Define user object structure
interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
  profileImage: string | null;
}

// Define conversation type
interface Conversation {
  user: User;
  latestMessage: Message;
  unreadCount: number;
}

const Messages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [starredContacts, setStarredContacts] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { user, getToken } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://rentalke-server-2.onrender.com/api/v1";

  // Initialize socket connection when component mounts
  useEffect(() => {
    const token = getToken();
    if (token) {
      const socket = initializeSocket(token);
      
      // Setup socket event listeners
      socket.on('new_message', (data: { message: Message; sender: User }) => {
        if (selectedConversation && 
            (data.message.senderId === selectedConversation.user.id || 
             data.message.receiverId === selectedConversation.user.id)) {
          setMessages(prev => [...prev, data.message]);
          markMessageAsRead(data.message.id);
        }
        
        // Update conversations list
        fetchConversations();
      });
      
      // Clean up socket connection on unmount
      return () => {
        socket.off('new_message');
      };
    }
  }, [getToken, selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, [getToken]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.user.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/admin/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data.conversations);
      
      // If no conversation is selected and there are conversations, select the first one
      if (!selectedConversation && response.data.conversations.length > 0) {
        setSelectedConversation(response.data.conversations[0]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
      // Set fallback data for demo purposes
      setConversations(messagesData.map(msg => ({
        user: {
          id: `fallback-${msg.id}`,
          firstName: msg.sender.name.split(' ')[0],
          lastName: msg.sender.name.split(' ')[1] || '',
          email: `${msg.sender.name.toLowerCase().replace(' ', '.')}@example.com`,
          role: msg.sender.role,
          profileImage: msg.sender.avatar
        },
        latestMessage: {
          id: `msg-${msg.id}`,
          senderId: `fallback-${msg.id}`,
          receiverId: user?.id || 'admin',
          message: msg.message,
          status: 'SENT',
          isRead: msg.read,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        unreadCount: msg.read ? 0 : 1
      })));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    setLoadingMessages(true);
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/admin/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.messages);
      
      // Mark all unread messages as read
      const unreadMessages = response.data.messages.filter(
        (msg: Message) => !msg.isRead && msg.senderId === userId
      );
      unreadMessages.forEach((msg: Message) => {
        markMessageAsRead(msg.id);
      });
      
      // Update conversations to reflect read messages
      if (unreadMessages.length > 0) {
        fetchConversations();
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
      // Set fallback data
      setMessages([
        {
          id: 'fallback-msg-1',
          senderId: selectedConversation?.user.id || 'fallback-user',
          receiverId: user?.id || 'admin',
          message: 'This is a fallback message since we could not connect to the server.',
          status: 'SENT',
          isRead: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'fallback-msg-2',
          senderId: user?.id || 'admin',
          receiverId: selectedConversation?.user.id || 'fallback-user',
          message: 'This is a fallback reply.',
          status: 'DELIVERED',
          isRead: true,
          createdAt: new Date(Date.now() + 60000).toISOString(),
          updatedAt: new Date(Date.now() + 60000).toISOString()
        }
      ]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    try {
      // Send the message through socket
      sendMessage(selectedConversation.user.id, messageText);
      
      // Optimistically add message to UI
      const newMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: user?.id || 'admin',
        receiverId: selectedConversation.user.id,
        message: messageText,
        status: 'SENT',
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageText("");
      
      // Clear typing indicator
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        setTypingTimeout(null);
      }
      sendTypingStatus(selectedConversation.user.id, false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const toggleStar = async (userId: string) => {
    setStarredContacts(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
    
    try {
      const token = getToken();
      await axios.post(`${API_BASE_URL}/admin/contacts/star/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Error starring contact:", error);
      // Revert on error
      setStarredContacts(prev => 
        prev.includes(userId) 
          ? prev.filter(id => id !== userId) 
          : [...prev, userId]
      );
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    
    if (!selectedConversation) return;
    
    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true);
      sendTypingStatus(selectedConversation.user.id, true);
    }
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set timeout to stop typing indicator after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      setIsTyping(false);
      sendTypingStatus(selectedConversation.user.id, false);
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getGroupedMessages = () => {
    const groups: Record<string, Message[]> = {};
    
    messages.forEach(message => {
      const date = formatMessageDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };

  const getUserName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else {
      return user.email.split('@')[0];
    }
  };

  const getUserInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    } else if (user.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    } else {
      return user.email.substring(0, 2).toUpperCase();
    }
  };

  const filteredConversations = conversations.filter(
    conversation => {
      const userName = getUserName(conversation.user).toLowerCase();
      const userEmail = conversation.user.email.toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      
      return userName.includes(searchLower) || 
             userEmail.includes(searchLower) ||
             conversation.latestMessage.message.toLowerCase().includes(searchLower);
    }
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
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-4">
                    <p className="text-muted-foreground">
                      {searchQuery ? "No contacts match your search" : "No conversations yet"}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-full px-2">
                    <div className="space-y-1">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.user.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                            selectedConversation?.user.id === conversation.user.id
                              ? "bg-muted"
                              : ""
                          }`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage src={conversation.user.profileImage || undefined} />
                            <AvatarFallback>
                              {getUserInitials(conversation.user)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-medium truncate">
                                {getUserName(conversation.user)}
                              </p>
                              <div className="flex items-center">
                                {conversation.unreadCount > 0 && (
                                  <Badge variant="default" className="h-5 w-5 rounded-full flex items-center justify-center p-0 text-[10px]">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStar(conversation.user.id);
                                  }} 
                                  className="ml-2 text-muted-foreground hover:text-amber-400"
                                >
                                  {starredContacts.includes(conversation.user.id) ? (
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  ) : (
                                    <StarOff className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.latestMessage.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTime(conversation.latestMessage.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Area */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {selectedConversation ? (
                <>
                  <CardHeader className="border-b flex-none px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={selectedConversation.user.profileImage || undefined} />
                          <AvatarFallback>
                            {getUserInitials(selectedConversation.user)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{getUserName(selectedConversation.user)}</CardTitle>
                          <CardDescription>{selectedConversation.user.role}</CardDescription>
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
                    {loadingMessages ? (
                      <div className="h-full flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <ScrollArea className="h-full p-6">
                        {getGroupedMessages().map((group, groupIndex) => (
                          <div key={groupIndex} className="space-y-4 mb-6">
                            <div className="flex justify-center">
                              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                {group.date}
                              </span>
                            </div>
                            {group.messages.map((message, messageIndex) => (
                              <div 
                                key={message.id} 
                                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                              >
                                <div 
                                  className={`p-3 rounded-lg max-w-[80%] ${
                                    message.senderId === user?.id 
                                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                      : 'bg-muted rounded-tl-none'
                                  }`}
                                >
                                  <p className="text-sm">{message.message}</p>
                                  <span 
                                    className={`text-xs ${
                                      message.senderId === user?.id 
                                        ? 'text-primary-foreground/80' 
                                        : 'text-muted-foreground'
                                    }`}
                                  >
                                    {formatTime(message.createdAt)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </ScrollArea>
                    )}
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
                        onChange={handleTyping}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        size="icon" 
                        className="rounded-full" 
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 p-4 rounded-full bg-muted">
                    <Send className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Your Messages</h3>
                  <p className="text-muted-foreground mb-6">
                    Select a conversation or start a new one
                  </p>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    New Message
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Messages;
