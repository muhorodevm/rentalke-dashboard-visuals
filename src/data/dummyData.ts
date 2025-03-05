
import { 
  Users, Home, CreditCard, PieChart, MessageSquare, 
  Settings, Bell, HelpCircle, LogOut, Shield, AlertTriangle 
} from 'lucide-react';

// Sidebar navigation items
export const navigationItems = [
  { 
    name: 'Dashboard', 
    path: '/', 
    icon: Home 
  },
  { 
    name: 'Analytics', 
    path: '/analytics', 
    icon: PieChart 
  },
  { 
    name: 'Messages', 
    path: '/messages', 
    icon: MessageSquare 
  },
  { 
    name: 'Users', 
    path: '/users', 
    icon: Users
  },
  { 
    name: 'Payments', 
    path: '/payments', 
    icon: CreditCard 
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: Settings 
  },
];

// User profile data
export const userProfile = {
  name: 'John Doe',
  email: 'john.doe@rentalke.com',
  role: 'Admin',
  avatar: 'https://i.pravatar.cc/300',
};

// Dashboard metrics data
export const metricsData = [
  {
    title: 'Total Managers',
    value: 124,
    change: 12,
    changeType: 'increase', // 'increase' or 'decrease'
    changePercentage: 10.7,
    color: 'rentalke-blue'
  },
  {
    title: 'Total Clients',
    value: 3845,
    change: 256,
    changeType: 'increase',
    changePercentage: 7.1,
    color: 'rentalke-green'
  },
  {
    title: 'Active Rentals',
    value: 2967,
    change: 154,
    changeType: 'increase',
    changePercentage: 5.5,
    color: 'rentalke-apple'
  },
  {
    title: 'Total Revenue',
    value: '$429,582',
    change: '$32,450',
    changeType: 'increase',
    changePercentage: 8.2,
    color: 'rentalke-blue'
  }
];

// Growth data for charts
export const monthlyGrowthData = [
  { month: 'Jan', managers: 82, clients: 2100 },
  { month: 'Feb', managers: 87, clients: 2250 },
  { month: 'Mar', managers: 89, clients: 2380 },
  { month: 'Apr', managers: 92, clients: 2500 },
  { month: 'May', managers: 98, clients: 2690 },
  { month: 'Jun', managers: 103, clients: 2850 },
  { month: 'Jul', managers: 108, clients: 3000 },
  { month: 'Aug', managers: 112, clients: 3200 },
  { month: 'Sep', managers: 116, clients: 3400 },
  { month: 'Oct', managers: 120, clients: 3650 },
  { month: 'Nov', managers: 124, clients: 3845 }
];

// System health data
export const systemHealthData = [
  { name: 'Server Load', value: 68, status: 'healthy' },
  { name: 'Database', value: 92, status: 'healthy' },
  { name: 'API Response', value: 89, status: 'healthy' },
  { name: 'Memory Usage', value: 74, status: 'healthy' }
];

// Recent notifications
export const notificationsData = [
  {
    id: 1,
    title: 'New Manager Registration',
    message: 'Sarah Johnson has registered as a new manager.',
    time: '10 minutes ago',
    read: false,
    type: 'info'
  },
  {
    id: 2,
    title: 'System Update',
    message: 'System will undergo maintenance at 2:00 AM.',
    time: '1 hour ago',
    read: false,
    type: 'warning'
  },
  {
    id: 3,
    title: 'Potential Fraud Alert',
    message: 'Unusual activity detected on Account #387.',
    time: '2 hours ago',
    read: true,
    type: 'alert'
  },
  {
    id: 4,
    title: 'New Client Registration',
    message: 'Michael Smith has registered as a new client.',
    time: '3 hours ago',
    read: true,
    type: 'info'
  },
  {
    id: 5,
    title: 'Payment Received',
    message: 'Payment of $1,200 received from Client #3421.',
    time: '5 hours ago',
    read: true,
    type: 'success'
  }
];

// Recent messages
export const messagesData = [
  {
    id: 1,
    sender: {
      name: 'Emily Parker',
      avatar: 'https://i.pravatar.cc/300?img=1',
      role: 'Property Manager'
    },
    message: 'I need help with the new payment processing system.',
    time: '10 minutes ago',
    read: false
  },
  {
    id: 2,
    sender: {
      name: 'David Wilson',
      avatar: 'https://i.pravatar.cc/300?img=2',
      role: 'Maintenance Manager'
    },
    message: 'The maintenance reports for Building B are ready for review.',
    time: '45 minutes ago',
    read: false
  },
  {
    id: 3,
    sender: {
      name: 'Sophia Martinez',
      avatar: 'https://i.pravatar.cc/300?img=3',
      role: 'Client Services'
    },
    message: 'Client #283 has some questions about their lease renewal.',
    time: '2 hours ago',
    read: true
  },
  {
    id: 4,
    sender: {
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/300?img=4',
      role: 'Marketing Manager'
    },
    message: 'Can we discuss the new promo campaign for downtown properties?',
    time: '5 hours ago',
    read: true
  }
];

// Alert data
export const alertsData = [
  {
    id: 1,
    title: 'Potential Fraud Activity',
    description: 'Multiple failed login attempts detected for user ID #4587.',
    severity: 'high',
    time: '15 minutes ago',
    icon: AlertTriangle
  },
  {
    id: 2,
    title: 'System Security Update',
    description: 'Critical security patch needs to be applied within 24 hours.',
    severity: 'medium',
    time: '2 hours ago',
    icon: Shield
  },
  {
    id: 3,
    title: 'Unusual Payment Pattern',
    description: 'Unusual payment activity detected on Property ID #2341.',
    severity: 'medium',
    time: '4 hours ago',
    icon: AlertTriangle
  }
];
