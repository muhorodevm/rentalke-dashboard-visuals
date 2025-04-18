
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ArrowLeft, Search, Plus, ChevronLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/messages/EmptyState';
import MessageItem from '@/components/messages/MessageItem';
import ContactsList from '@/components/messages/ContactsList';
import ConversationHeader from '@/components/messages/ConversationHeader';
import TypingIndicator from '@/components/messages/TypingIndicator';
import MessageComposer from '@/components/messages/MessageComposer';
import { mockContacts, mockConversations, Contact, Message } from '@/data/mockMessagesData';
import { useMediaQuery } from '@/hooks/use-media-query';

const Messages = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [showConversation, setShowConversation] = useState(!isMobile);
  
  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && contact.unread && contact.unread > 0;
    if (activeTab === 'online') return matchesSearch && contact.status === 'online';
    return matchesSearch;
  });

  // Show/hide conversation based on screen size and selection
  useEffect(() => {
    if (isMobile) {
      setShowConversation(!!selectedContact);
    } else {
      setShowConversation(true);
    }
  }, [isMobile, selectedContact]);

  useEffect(() => {
    if (selectedContact) {
      setLoading(true);
      setTimeout(() => {
        setMessages(mockConversations[selectedContact.id] || []);
        setLoading(false);
        
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addNewIncomingMessage = () => {
    if (selectedContact && selectedContact.id === '1') {
      const newMsg = {
        id: `m${messages.length + 1}`,
        sender: '1',
        text: "Thanks for the information! I'll make the payment today.",
        time: '10:40 AM',
        status: 'received' as const
      };
      setMessages([...messages, newMsg]);
    }
  };

  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim() || !selectedContact) return;
    
    const newMsg: Message = {
      id: `m${messages.length + 1}`,
      sender: 'me',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    setMessages([...messages, newMsg]);
    
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

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? {...msg, reactions: [...(msg.reactions || []), emoji]} 
          : msg
      )
    );
  };

  const handleBackToContactsList = () => {
    setSelectedContact(null);
    setShowConversation(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-1">
          Communicate with your team and tenants.
        </p>
      </div>

      <Card className="border rounded-xl overflow-hidden shadow-sm bg-gradient-to-b from-background to-card">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(80vh-13rem)]">
          {/* Contacts List - Hidden on mobile when conversation is shown */}
          <AnimatePresence mode="wait">
            {(!isMobile || !showConversation) && (
              <motion.div 
                key="contacts"
                initial={isMobile ? { x: -300, opacity: 0 } : { opacity: 0 }}
                animate={isMobile ? { x: 0, opacity: 1 } : { opacity: 1 }}
                exit={isMobile ? { x: -300, opacity: 0 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:col-span-1 border-r h-full flex flex-col"
              >
                <div className="p-4 border-b">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-9 pr-4 py-2 bg-muted/50 border-none h-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="unread">Unread</TabsTrigger>
                      <TabsTrigger value="online">Online</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <ScrollArea className="flex-1">
                  <ContactsList 
                    contacts={filteredContacts}
                    selectedContact={selectedContact}
                    onSelectContact={(contact) => {
                      setSelectedContact(contact);
                      if (isMobile) setShowConversation(true);
                    }}
                  />
                  
                  {filteredContacts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No contacts found
                    </div>
                  )}
                </ScrollArea>
                
                <div className="p-3 border-t bg-card/50">
                  <Button className="w-full" onClick={() => toast({
                    title: "Coming soon!",
                    description: "This feature is under development."
                  })}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Conversation
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Conversation - Hidden on mobile when contact list is shown */}
          <AnimatePresence mode="wait">
            {(!isMobile || showConversation) && (
              <motion.div
                key="conversation"
                initial={isMobile ? { x: 300, opacity: 0 } : { opacity: 0 }}
                animate={isMobile ? { x: 0, opacity: 1 } : { opacity: 1 }}
                exit={isMobile ? { x: 300, opacity: 0 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:col-span-2 flex flex-col h-full"
              >
                {selectedContact ? (
                  <>
                    <div className="flex items-center border-b p-3">
                      {isMobile && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={handleBackToContactsList}
                          className="mr-2"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                      )}
                      <ConversationHeader contact={selectedContact} />
                    </div>
                    
                    <ScrollArea className="flex-1 px-4 py-3 bg-gradient-to-b from-background/50 to-card/50">
                      {loading ? (
                        <div className="flex justify-center items-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : messages.length > 0 ? (
                        <div className="space-y-6">
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
                          
                          {isTyping && <TypingIndicator contactName={selectedContact.name} />}
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
                    
                    <MessageComposer onSendMessage={handleSendMessage} />
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
};

export default Messages;
