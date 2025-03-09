
import React, { useState } from 'react';
import { Send, Smile, PaperclipIcon, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MessageComposerProps {
  onSendMessage: (message: string) => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  return (
    <div className="flex items-center gap-1.5 w-full p-3 border-t bg-card/50">
      <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
        <PaperclipIcon className="h-5 w-5" />
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
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
      
      <Input
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        className="flex-1 bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
      />
      
      {newMessage.trim() ? (
        <Button 
          onClick={handleSend}
          size="icon"
          className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      ) : (
        <Button 
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Mic className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default MessageComposer;
