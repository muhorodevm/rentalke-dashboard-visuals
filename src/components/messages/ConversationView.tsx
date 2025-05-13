
import React, { useEffect, useRef } from 'react';
import { Loader2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ConversationHeader from '@/components/messages/ConversationHeader';
import MessageItem from '@/components/messages/MessageItem';
import TypingIndicator from '@/components/messages/TypingIndicator';
import MessageInput from '@/components/messages/MessageInput';
import { Contact, Message } from '@/data/mockMessagesData';

interface ConversationViewProps {
  contact: Contact | null;
  messages: Message[];
  isTyping: boolean;
  loading: boolean;
  onSendMessage: (message: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onBack: () => void;
  isMobile: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  contact,
  messages,
  isTyping,
  loading,
  onSendMessage,
  onAddReaction,
  onBack,
  isMobile
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!contact) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-muted-foreground">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center border-b p-3">
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <ConversationHeader contact={contact} />
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
                  contact={contact}
                  onAddReaction={(emoji) => onAddReaction(message.id, emoji)}
                />
              ))}
            </AnimatePresence>
            
            {isTyping && <TypingIndicator contactName={contact.name} />}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground mt-1">Start the conversation by sending a message</p>
            </motion.div>
          </div>
        )}
      </ScrollArea>
      
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ConversationView;
