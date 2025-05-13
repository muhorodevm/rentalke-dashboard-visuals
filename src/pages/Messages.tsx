
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
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useIsMobile } from '@/hooks/use-mobile';

const Messages = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  const [showConversation, setShowConversation] = useState(!isMobile);
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  const [conversationsData, setConversationsData] = useState({...mockConversations});
  
  // Use scroll to top hook for proper navigation
  useScrollToTop();
  
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

  // Load conversation data when contact is selected
  useEffect(() => {
    if (selectedContact) {
      setLoading(true);
      setTimeout(() => {
        const currentConversation = conversationsData[selectedContact.id] || [];
        setMessages(currentConversation);
        setLoading(false);
      }, 300);
    }
  }, [selectedContact, conversationsData]);

  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim() || !selectedContact) return;
    
    const newMsg: Message = {
      id: `m${Date.now()}`,
      sender: 'me',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    
    // Update conversations data
    setConversationsData(prev => ({
      ...prev,
      [selectedContact.id]: updatedMessages
    }));
    
    // Update message status to delivered and then read after a delay
    setTimeout(() => {
      setMessages(prev => {
        const updated = prev.map(msg => 
          msg.id === newMsg.id ? {...msg, status: 'delivered' as const} : msg
        );
        
        setConversationsData(prevData => ({
          ...prevData,
          [selectedContact.id]: updated
        }));
        
        return updated;
      });
    }, 1000);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(prev => {
      const updated = prev.map(msg => 
        msg.id === messageId 
          ? {...msg, reactions: [...(msg.reactions || []), emoji]} 
          : msg
      );
      
      // Update conversations data with reaction
      if (selectedContact) {
        setConversationsData(prevData => ({
          ...prevData,
          [selectedContact.id]: updated
        }));
      }
      
      return updated;
    });
  };
  
  const handleEditMessage = (messageId: string, newText: string) => {
    setMessages(prev => {
      const updated = prev.map(msg => 
        msg.id === messageId ? {...msg, text: newText} : msg
      );
      
      // Update conversations data with edit
      if (selectedContact) {
        setConversationsData(prevData => ({
          ...prevData,
          [selectedContact.id]: updated
        }));
      }
      
      return updated;
    });
  };
  
  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => {
      const updated = prev.filter(msg => msg.id !== messageId);
      
      // Update conversations data after deletion
      if (selectedContact) {
        setConversationsData(prevData => ({
          ...prevData,
          [selectedContact.id]: updated
        }));
      }
      
      return updated;
    });
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

      <Card className="border rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(85vh-10rem)]">
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
                <div className="p-4 border-b bg-card/60 sticky top-0 z-10">
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
                
                <ScrollArea className="flex-1 h-full">
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
                
                <div className="p-3 border-t bg-card/50 sticky bottom-0">
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
                className="md:col-span-2 flex flex-col h-full overflow-hidden"
              >
                {selectedContact ? (
                  <ConversationView 
                    contact={selectedContact}
                    messages={messages}
                    loading={loading}
                    onSendMessage={handleSendMessage}
                    onAddReaction={handleAddReaction}
                    onEditMessage={handleEditMessage}
                    onDeleteMessage={handleDeleteMessage}
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
