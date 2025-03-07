
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  onNewConversation: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onNewConversation }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full p-8 text-center"
    >
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <MessageSquarePlus className="h-8 w-8 text-primary" />
      </div>
      <h3 className="font-medium text-lg mb-2">No conversation selected</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        Select a conversation from the list or start a new one to begin messaging.
      </p>
      <Button onClick={onNewConversation}>
        <MessageSquarePlus className="mr-2 h-4 w-4" />
        New Conversation
      </Button>
    </motion.div>
  );
};

export default EmptyState;
