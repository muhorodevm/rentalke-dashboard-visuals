
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Contact } from '@/data/mockMessagesData';

interface ContactsListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ 
  contacts, 
  selectedContact, 
  onSelectContact 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-0.5 py-1">
      {contacts.map((contact) => (
        <motion.div
          key={contact.id}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelectContact(contact)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 cursor-pointer relative border-b border-border/30 last:border-0",
            selectedContact?.id === contact.id 
              ? "bg-primary/10 dark:bg-primary/20" 
              : "hover:bg-muted/50"
          )}
        >
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-background">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {contact.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span 
              className={cn(
                "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background",
                getStatusColor(contact.status)
              )}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <p className={cn(
                "text-sm font-medium truncate",
                contact.unread ? "font-semibold" : ""
              )}>
                {contact.name}
              </p>
              {contact.lastSeen && !contact.unread && (
                <span className="text-xs text-muted-foreground">{contact.lastSeen}</span>
              )}
            </div>
            <div className="flex justify-between items-center mt-0.5">
              <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                {contact.lastMessage || contact.role}
              </p>
              {contact.unread ? (
                <Badge variant="default" className="text-xs px-1.5 py-0 h-5 ml-1 bg-primary hover:bg-primary">
                  {contact.unread}
                </Badge>
              ) : null}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ContactsList;
