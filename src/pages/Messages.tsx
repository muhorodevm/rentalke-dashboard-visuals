
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Search, Send, Smile, ThumbsUp, Heart, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import EmptyState from '@/components/messages/EmptyState';
import MessageItem from '@/components/messages/MessageItem';
import ContactsList from '@/components/messages/ContactsList';
import ConversationHeader from '@/components/messages/ConversationHeader';

// Mock data - would be replaced with real API calls
const mockContacts = [
  { id: '1', name: 'Jane Cooper', role: 'Property Manager', avatar: 'https://i.pravatar.cc/150?img=1', status: 'online', unread: 3 },
  { id: '2', name: 'Robert Fox', role: 'Tenant', avatar: 'https://i.pravatar.cc/150?img=2', status: 'offline', lastSeen: '3h ago' },
  { id: '3', name: 'Esther Howard', role: 'Admin', avatar: 'https://i.pravatar.cc/150?img=3', status: 'away', lastSeen: '1h ago' },
  { id: '4', name: 'Leslie Alexander', role: 'Maintenance', avatar: 'https://i.pravatar.cc/150?img=4', status: 'online' },
  { id: '5', name: 'Guy Hawkins', role: 'Tenant', avatar: 'https://i.pravatar.cc/150?img=5', status: 'offline', lastSeen: '1d ago' },
];

const mockConversations = {
  '1': [
    { id: 'm1', sender: '1', text: 'Hello, I have a question about the rent payment', time: '10:30 AM', status: 'read', reactions: ['👍'] },
    { id: 'm2', sender: 'me', text: 'Sure, what would you like to know?', time: '10:32 AM', status: 'delivered' },
    { id: 'm3', sender: '1', text: 'Can I pay with a credit card this month?', time: '10:33 AM', status: 'read' },
    { id: 'm4', sender: 'me', text: 'Yes, we accept credit card payments. There is a 2% processing fee.', time: '10:35 AM', status: 'delivered' },
  ],
  '3': [
    { id: 'm1', sender: '3', text: 'The new tenant portal looks great!', time: '9:15 AM', status: 'read', reactions: ['❤️'] },
    { id: 'm2', sender: 'me', text: 'Thank you! We worked hard on it.', time: '9:20 AM', status: 'read' },
  ],
};

const Messages = () => {
  const { toast } = useToast();
  const { user, getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Filter contacts based on search query and tab
  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && contact.unread;
    if (activeTab === 'online') return matchesSearch && contact.status === 'online';
    return matchesSearch;
  });

  // Load messages for selected contact
  useEffect(() => {
    if (selectedContact) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setMessages(mockConversations[selectedContact.id] || []);
        setLoading(false);
        
        // Simulate typing indicator
        if (selectedContact.id === '1') {
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addNewIncomingMessage();
            }, 3000);
          }, 5000);
        }
      }, 800);
    }
  }, [selectedContact]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addNewIncomingMessage = () => {
    if (selectedContact && selectedContact.id === '1') {
      const newMsg = {
        id: `m${messages.length + 1}`,
        sender: '1',
        text: 'Thanks for the information! I'll make the payment today.',
        time: '10:40 AM',
        status: 'received'
      };
      setMessages([...messages, newMsg]);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    const newMsg = {
      id: `m${messages.length + 1}`,
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMsg.id ? {...msg, status: 'delivered'} : msg
        )
      );
      
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMsg.id ? {...msg, status: 'read'} : msg
          )
        );
      }, 1000);
    }, 1000);
  };

  const handleAddReaction = (messageId, emoji) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? {...msg, reactions: [...(msg.reactions || []), emoji]} 
          : msg
      )
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-1">
          Communicate with your team and tenants.
        </p>
      </div>

      <Card className="border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(80vh-13rem)]">
          {/* Contacts Side */}
          <div className="border-r md:col-span-1">
            <CardHeader className="p-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="px-4">
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="online">Online</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-[calc(80vh-20rem)]">
                <ContactsList 
                  contacts={filteredContacts}
                  selectedContact={selectedContact}
                  onSelectContact={(contact) => setSelectedContact(contact)}
                />
                
                {filteredContacts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No contacts found
                  </div>
                )}
              </ScrollArea>
            </Tabs>
          </div>
          
          {/* Chat Area */}
          <div className="md:col-span-2 flex flex-col">
            {selectedContact ? (
              <>
                <ConversationHeader contact={selectedContact} />
                
                <ScrollArea className="flex-1 p-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {messages.map((message) => (
                          <MessageItem 
                            key={message.id}
                            message={message}
                            contact={selectedContact}
                            onAddReaction={(emoji) => handleAddReaction(message.id, emoji)}
                          />
                        ))}
                      </AnimatePresence>
                      
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="flex gap-1">
                            <span className="animate-bounce delay-0 h-2 w-2 rounded-full bg-gray-400"></span>
                            <span className="animate-bounce delay-150 h-2 w-2 rounded-full bg-gray-400"></span>
                            <span className="animate-bounce delay-300 h-2 w-2 rounded-full bg-gray-400"></span>
                          </div>
                          {selectedContact.name} is typing...
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <div className="text-center">
                        <p className="text-muted-foreground">No messages yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Send a message to start the conversation</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
                
                <CardFooter className="p-4 border-t">
                  <div className="flex items-center gap-2 w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <Smile className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64" align="start">
                        <div className="grid grid-cols-6 gap-2">
                          {['😊', '😂', '👍', '❤️', '🎉', '🔥', '👏', '🙏', '💯', '⭐', '❓', '⚡'].map(emoji => (
                            <button
                              key={emoji}
                              className="text-2xl p-2 hover:bg-muted rounded-md"
                              onClick={() => {
                                setNewMessage(prev => prev + emoji);
                              }}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1"
                    />
                    
                    <Button 
                      disabled={!newMessage.trim()}
                      onClick={handleSendMessage}
                      className="shrink-0"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <EmptyState onNewConversation={() => {
                if (filteredContacts.length > 0) {
                  setSelectedContact(filteredContacts[0]);
                } else {
                  toast({
                    title: "No contacts available",
                    description: "Please add contacts to start a conversation."
                  });
                }
              }} />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Messages;
