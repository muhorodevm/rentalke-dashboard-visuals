
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Smile, MoreVertical, Edit, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

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
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newText: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  contact, 
  onAddReaction, 
  onDeleteMessage, 
  onEditMessage 
}) => {
  const isMe = message.sender === 'me';
  const [showReactions, setShowReactions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const editInputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      // Position cursor at the end of text
      editInputRef.current.selectionStart = editInputRef.current.value.length;
    }
  }, [isEditing]);

  const handleEditSubmit = () => {
    if (!editText.trim()) {
      toast({
        title: "Error",
        description: "Message cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (editText !== message.text && onEditMessage) {
      onEditMessage(message.id, editText);
      toast({
        description: "Message updated successfully",
      });
    }
    setIsEditing(false);
  };

  const handleDeleteMessage = () => {
    if (onDeleteMessage) {
      onDeleteMessage(message.id);
      setShowDeleteDialog(false);
      toast({
        description: "Message deleted successfully",
      });
    }
  };
  
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
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {contact.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("max-w-[80%] sm:max-w-[70%]", isMe ? "items-end" : "items-start")}>
        <div className="flex items-end gap-2">
          <div
            className={cn(
              "rounded-2xl p-3 relative group",
              isMe 
                ? "bg-primary text-primary-foreground rounded-br-none" 
                : "bg-card border rounded-bl-none"
            )}
          >
            {isEditing ? (
              <div className="min-w-[200px]">
                <Textarea
                  ref={editInputRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[60px] mb-2 p-1 text-sm border bg-background text-foreground"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleEditSubmit();
                    }
                    if (e.key === 'Escape') {
                      setIsEditing(false);
                      setEditText(message.text);
                    }
                  }}
                />
                <div className="flex justify-end gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(message.text);
                    }}
                    className="h-6 px-2"
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleEditSubmit}
                    className="h-6 px-2"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
            )}
            
            {isMe && !isEditing && (
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-muted">
                      <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem 
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)}
                      className="cursor-pointer text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            
            <Popover open={showReactions} onOpenChange={setShowReactions}>
              <PopoverTrigger asChild>
                <button className="hidden group-hover:flex absolute -bottom-3 right-2 bg-background border rounded-full p-1 shadow-sm cursor-pointer">
                  <Smile className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
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
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMessage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default MessageItem;
