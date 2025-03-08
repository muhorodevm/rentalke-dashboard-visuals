
import React from 'react';
import { MoreHorizontal, Phone, Video } from 'lucide-react';
import { CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Contact } from '@/data/mockMessagesData';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ConversationHeaderProps {
  contact: Contact;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ contact }) => {
  const getStatusText = (status: string, lastSeen?: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return lastSeen ? `Last seen ${lastSeen}` : 'Offline';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'offline': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={contact.avatar} />
          <AvatarFallback>
            {contact.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-sm">{contact.name}</h3>
          <p className={cn(
            "text-xs flex items-center gap-1",
            getStatusColor(contact.status)
          )}>
            <span className={cn(
              "h-1.5 w-1.5 rounded-full",
              contact.status === 'online' ? 'bg-green-500' : 
              contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
            )} />
            {getStatusText(contact.status, contact.lastSeen)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View contact info</DropdownMenuItem>
            <DropdownMenuItem>Search in conversation</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Block contact</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
  );
};

export default ConversationHeader;
