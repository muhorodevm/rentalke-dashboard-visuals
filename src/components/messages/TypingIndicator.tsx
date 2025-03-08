
import React from 'react';
import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  contactName: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ contactName }) => {
  return (
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
      {contactName} is typing...
    </motion.div>
  );
};

export default TypingIndicator;
