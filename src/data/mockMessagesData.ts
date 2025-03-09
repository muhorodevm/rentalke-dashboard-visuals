export type ContactStatus = 'online' | 'offline' | 'away';

export interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: ContactStatus;
  unread?: number;
  lastSeen?: string;
  lastMessage?: string;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read' | 'received';
  reactions?: string[];
}

export type Conversations = {
  [key: string]: Message[];
};

export const mockContacts: Contact[] = [
  { id: '1', name: 'Jane Cooper', role: 'Property Manager', avatar: 'https://i.pravatar.cc/150?img=1', status: 'online', unread: 3, lastMessage: 'Hello, I have a question about the rent payment' },
  { id: '2', name: 'Robert Fox', role: 'Tenant', avatar: 'https://i.pravatar.cc/150?img=2', status: 'offline', lastSeen: '3h ago', lastMessage: 'Hi, when will the maintenance team fix the bathroom leak?' },
  { id: '3', name: 'Esther Howard', role: 'Admin', avatar: 'https://i.pravatar.cc/150?img=3', status: 'away', lastSeen: '1h ago', lastMessage: 'The new tenant portal looks great!' },
  { id: '4', name: 'Leslie Alexander', role: 'Maintenance', avatar: 'https://i.pravatar.cc/150?img=4', status: 'online', lastMessage: 'Just completed the repair work on unit 305' },
  { id: '5', name: 'Guy Hawkins', role: 'Tenant', avatar: 'https://i.pravatar.cc/150?img=5', status: 'offline', lastSeen: '1d ago', lastMessage: 'When is the next community meeting?' },
  { id: '6', name: 'Wade Warren', role: 'Security', avatar: 'https://i.pravatar.cc/150?img=6', status: 'online', lastMessage: 'All security checks completed for today' },
  { id: '7', name: 'Cameron Williamson', role: 'Accounting', avatar: 'https://i.pravatar.cc/150?img=7', status: 'offline', lastSeen: '5h ago', lastMessage: 'Monthly financial report is ready for review' },
  { id: '8', name: 'Brooklyn Simmons', role: 'Marketing', avatar: 'https://i.pravatar.cc/150?img=8', status: 'away', lastSeen: '30m ago', lastMessage: 'New marketing materials are ready for approval' },
];

export const mockConversations: Conversations = {
  '1': [
    { id: 'm1', sender: '1', text: 'Hello, I have a question about the rent payment', time: '10:30 AM', status: 'read', reactions: ['👍'] },
    { id: 'm2', sender: 'me', text: 'Sure, what would you like to know?', time: '10:32 AM', status: 'delivered' },
    { id: 'm3', sender: '1', text: 'Can I pay with a credit card this month?', time: '10:33 AM', status: 'read' },
    { id: 'm4', sender: 'me', text: 'Yes, we accept credit card payments. There is a 2% processing fee.', time: '10:35 AM', status: 'delivered' },
  ],
  '2': [
    { id: 'm1', sender: '2', text: 'Hi, when will the maintenance team fix the bathroom leak?', time: '9:45 AM', status: 'read' },
    { id: 'm2', sender: 'me', text: 'They are scheduled to come tomorrow at 10 AM.', time: '9:47 AM', status: 'read' },
    { id: 'm3', sender: '2', text: 'Thanks! I will be home.', time: '9:48 AM', status: 'read' },
  ],
  '3': [
    { id: 'm1', sender: '3', text: 'The new tenant portal looks great!', time: '9:15 AM', status: 'read', reactions: ['❤️'] },
    { id: 'm2', sender: 'me', text: 'Thank you! We worked hard on it.', time: '9:20 AM', status: 'read' },
  ],
};
