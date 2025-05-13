
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Plus, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/messages/EmptyState';
import ContactsList from '@/components/messages/ContactsList';
import ConversationView from '@/components/messages/ConversationView';
import NewConversationDialog from '@/components/messages/NewConversationDialog';
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
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [showConversation, setShowConversation] = useState(!isMobile);
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  
  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         contact.role.toLowerCase().includes(searchQuery.toLowerCase());
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
          }, 2000);
        }
      }, 800);
    }
  }, [selectedContact]);

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
    
    // Simulate typing response for certain contacts
    if (['1', '4', '6'].includes(selectedContact.id)) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const responses = [
            "Got it! Thanks for letting me know.",
            "I understand, I'll take care of it.",
            "Thank you for your quick response!",
            "Perfect, that works for me.",
            "I'll check and get back to you soon."
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          const responseMsg: Message = {
            id: `m${messages.length + 2}`,
            sender: selectedContact.id,
            text: randomResponse,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'received'
          };
          
          setMessages(prev => [...prev, responseMsg]);
        }, 2000 + Math.random() * 1000);
      }, 1000);
    }
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

  const handleNewConversation = () => {
    setShowNewConversationDialog(true);
  };

  const handleSelectNewContact = (contact: Contact) => {
    setSelectedContact(contact);
    if (isMobile) {
      setShowConversation(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-1">
          Communicate with your team and tenants
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
                    onSelectContact={handleSelectNewContact}
                  />
                  
                  {filteredContacts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No contacts found
                    </div>
                  )}
                </ScrollArea>
                
                <div className="p-3 border-t bg-card/50">
                  <Button className="w-full" onClick={handleNewConversation}>
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
                  <ConversationView 
                    contact={selectedContact}
                    messages={messages}
                    isTyping={isTyping}
                    loading={loading}
                    onSendMessage={handleSendMessage}
                    onAddReaction={handleAddReaction}
                    onBack={handleBackToContactsList}
                    isMobile={isMobile}
                  />
                ) : (
                  <EmptyState onNewConversation={handleNewConversation} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <NewConversationDialog 
        open={showNewConversationDialog}
        onClose={() => setShowNewConversationDialog(false)}
        contacts={mockContacts}
        onSelectContact={handleSelectNewContact}
      />
    </div>
  );
};

export default Messages;
