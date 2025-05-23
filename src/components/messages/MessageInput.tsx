
import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  placeholder = "Type your message...", 
  disabled = false 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!newMessage.trim() || disabled) return;
    onSendMessage(newMessage);
    setNewMessage('');
    setRows(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      const newRows = Math.min(4, Math.max(1, Math.ceil(scrollHeight / 24)));
      setRows(newRows);
    }
  }, [newMessage]);

  return (
    <div className="flex items-center gap-2 p-3 bg-card/50">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground">
            <Smile className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="grid grid-cols-6 gap-2">
            {["😊", "😂", "👍", "❤️", "🎉", "🔥", "👏", "🙏", "💯", "⭐", "❓", "⚡", 
              "😍", "🤔", "😎", "👋", "🙌", "👌", "🤞", "✅", "⛔", "🎵", "🎁", "🚀"].map(emoji => (
              <button
                key={emoji}
                className="text-xl p-2 hover:bg-muted rounded-md"
                onClick={() => addEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="relative flex-1 rounded-lg bg-muted/30">
        <Textarea
          ref={textareaRef}
          placeholder={placeholder}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={rows}
          className={cn(
            "resize-none py-2 px-3 bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-lg",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        />
      </div>
      
      <Button 
        onClick={handleSend}
        size="icon"
        className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={disabled || !newMessage.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MessageInput;
