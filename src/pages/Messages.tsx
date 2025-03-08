
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmptyState from '@/components/messages/EmptyState';
import MessageItem from '@/components/messages/MessageItem';
import ContactsList from '@/components/messages/ContactsList';
import ConversationHeader from '@/components/messages/ConversationHeader';
import TypingIndicator from '@/components/messages/TypingIndicator';
import MessageComposer from '@/components/messages/MessageComposer';
import { mockContacts, mockConversations, Contact, Message } from '@/data/mockMessagesData';

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
  
  // Filter contacts based on search query and tab
  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && contact.unread && contact.unread > 0;
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

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? {...msg, reactions: [...(msg.reactions || []), emoji]} 
          : msg
      )
    );
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
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Messages;
