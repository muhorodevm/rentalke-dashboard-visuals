
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
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
        <MessageSquarePlus className="h-10 w-10 text-primary" />
      </div>
      <h3 className="font-medium text-xl mb-3">No conversation selected</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Select a conversation from the list or start a new one to begin messaging.
      </p>
      <Button onClick={onNewConversation} size="lg" className="rounded-full px-6">
        <MessageSquarePlus className="mr-2 h-5 w-5" />
        Start a new conversation
      </Button>
    </motion.div>
  );
};

export default EmptyState;
