
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MessageItemProps {
  message: {
    id: string;
    sender: string;
    text: string;
    time: string;
    status?: string;
    reactions?: string[];
  };
  contact: {
    id: string;
    name: string;
    avatar: string;
  };
  onAddReaction: (emoji: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, contact, onAddReaction }) => {
  const isMe = message.sender === 'me';
  const [showReactions, setShowReactions] = useState(false);
  
  const renderMessageStatus = () => {
    switch (message.status) {
      case 'sent':
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return (
          <div className="flex">
            <Check className="h-3 w-3 text-primary" />
            <Check className="h-3 w-3 text-primary -ml-1" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex gap-2 group",
        isMe ? "flex-row-reverse" : ""
      )}
    >
      {!isMe && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={contact.avatar} />
          <AvatarFallback>
            {contact.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="max-w-[75%]">
        <div className="flex items-end gap-2">
          <div
            className={cn(
              "rounded-lg p-3 relative group",
              isMe 
                ? "bg-primary text-primary-foreground rounded-tr-none" 
                : "bg-muted rounded-tl-none"
            )}
            onDoubleClick={() => setShowReactions(!showReactions)}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
            
            <Popover open={showReactions} onOpenChange={setShowReactions}>
              <PopoverTrigger className="hidden group-hover:flex absolute -bottom-4 right-2 bg-background border rounded-full p-1 shadow-sm cursor-pointer">
                <Smile className="h-4 w-4 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent className="w-min p-2" align={isMe ? "end" : "start"}>
                <div className="flex gap-1">
                  {['👍', '❤️', '🎉', '😂', '😮', '🔥'].map(emoji => (
                    <button
                      key={emoji}
                      className="text-lg p-1 hover:bg-muted rounded-md"
                      onClick={() => {
                        onAddReaction(emoji);
                        setShowReactions(false);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground mb-1 gap-1">
            {isMe && renderMessageStatus()}
            <span>{message.time}</span>
          </div>
        </div>
        
        {message.reactions && message.reactions.length > 0 && (
          <div className={cn(
            "flex gap-1 mt-1",
            isMe ? "justify-end" : "justify-start"
          )}>
            {message.reactions.map((reaction, index) => (
              <Badge key={index} variant="secondary" className="text-xs py-0 px-1.5 h-5">
                {reaction}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageItem;
