
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ConversationHeader from '@/components/messages/ConversationHeader';
import MessageItem from '@/components/messages/MessageItem';
import TypingIndicator from '@/components/messages/TypingIndicator';
import MessageInput from '@/components/messages/MessageInput';
import { Contact, Message } from '@/data/mockMessagesData';
import { useToast } from '@/hooks/use-toast';

interface ConversationViewProps {
  contact: Contact | null;
  messages: Message[];
  isTyping: boolean;
  loading: boolean;
  onSendMessage: (message: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onDeleteMessage: (messageId: string) => void;
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
  onEditMessage,
  onDeleteMessage,
  onBack,
  isMobile
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { toast } = useToast();
  
  // Handle scrolling
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Check if scroll is at bottom
  const checkScrollPosition = () => {
    if (!scrollAreaRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    // Consider "at bottom" if within 50px of bottom
    setIsAtBottom(distanceFromBottom < 50);
  };

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    } else if (messages.length > 0 && messages[messages.length - 1].sender === 'me') {
      // Always scroll to bottom when user sends a message
      scrollToBottom();
      setIsAtBottom(true);
    }
  }, [messages, isTyping]);

  // Initial scroll to bottom when conversation changes
  useEffect(() => {
    if (contact) {
      // Use immediate scroll without animation when opening a conversation
      setTimeout(() => scrollToBottom('auto'), 100);
      setIsAtBottom(true);
    }
  }, [contact]);

  if (!contact) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-muted-foreground">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center border-b p-3 bg-card/50 z-10 sticky top-0">
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
      
      <div 
        className="flex-1 relative overflow-hidden"
        style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
        <ScrollArea 
          className="flex-1 px-4 py-3 bg-gradient-to-b from-background/50 to-card/50 h-full"
          onScroll={checkScrollPosition}
          ref={scrollAreaRef}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-6 pb-2">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <MessageItem 
                    key={message.id}
                    message={message}
                    contact={contact}
                    onAddReaction={(emoji) => onAddReaction(message.id, emoji)}
                    onEditMessage={(messageId, newText) => onEditMessage(messageId, newText)}
                    onDeleteMessage={(messageId) => onDeleteMessage(messageId)}
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
                className="text-center p-4"
              >
                <p className="text-muted-foreground">No messages yet</p>
                <p className="text-sm text-muted-foreground mt-1">Start the conversation by sending a message</p>
              </motion.div>
            </div>
          )}
        </ScrollArea>
        
        {!isAtBottom && messages.length > 5 && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              scrollToBottom();
              setIsAtBottom(true);
            }}
            className="absolute bottom-4 right-4 rounded-full shadow-md opacity-90 hover:opacity-100 z-10"
          >
            <ChevronLeft className="h-4 w-4 -rotate-90" />
          </Button>
        )}
      </div>
      
      <div className="mt-auto border-t">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ConversationView;
