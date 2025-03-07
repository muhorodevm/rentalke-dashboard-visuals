
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: string;
  unread?: number;
  lastSeen?: string;
}

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
    <div className="space-y-1 py-2">
      {contacts.map((contact) => (
        <motion.div
          key={contact.id}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelectContact(contact)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer relative",
            selectedContact?.id === contact.id ? "bg-primary/10" : "hover:bg-muted"
          )}
        >
          <div className="relative">
            <Avatar>
              <AvatarImage src={contact.avatar} />
              <AvatarFallback>
                {contact.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span 
              className={cn(
                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
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
              {contact.unread ? (
                <Badge className="text-xs px-1.5 py-0 h-5">
                  {contact.unread}
                </Badge>
              ) : contact.lastSeen ? (
                <span className="text-xs text-muted-foreground">{contact.lastSeen}</span>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {contact.role}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ContactsList;
