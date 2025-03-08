import { 
  Users, Home, CreditCard, PieChart, MessageSquare, 
  Settings, Bell, HelpCircle, LogOut, Shield, AlertTriangle,
  Building
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
    name: 'Properties',
    path: '/properties',
    icon: Building
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

// Property data
export type PropertyType = 'estate' | 'building' | 'apartment' | 'house';
export type PropertyStatus = 'available' | 'occupied' | 'under-maintenance' | 'under-construction';

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  address: string;
  status: PropertyStatus;
  units?: number;
  manager: string;
  managerId: string;
  image?: string;
  description?: string;
  dateAdded: string;
  rent?: string;
  area?: string;
}

export const propertiesData: Property[] = [
  {
    id: 'p1',
    name: 'Sunset Gardens Estate',
    type: 'estate',
    address: '123 Sunset Blvd, Nairobi',
    status: 'under-construction',
    units: 24,
    manager: 'Jane Cooper',
    managerId: '1',
    image: 'https://images.unsplash.com/photo-1592595896616-c37162298647?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    description: 'A luxurious estate with 24 housing units, swimming pool, and 24/7 security.',
    dateAdded: '2023-01-15',
    area: '5 acres'
  },
  {
    id: 'p2',
    name: 'Green Towers',
    type: 'building',
    address: '456 Ngong Road, Nairobi',
    status: 'available',
    units: 120,
    manager: 'Robert Fox',
    managerId: '2',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    description: 'Modern residential building with 1, 2, and 3 bedroom apartments. Features gym, rooftop garden, and secure parking.',
    dateAdded: '2023-03-22',
    area: '3 acres'
  },
  {
    id: 'p3',
    name: 'Riverside Apartments',
    type: 'apartment',
    address: '789 Riverside Drive, Nairobi',
    status: 'occupied',
    manager: 'Esther Howard',
    managerId: '3',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    description: '3-bedroom luxury apartment with river view, fully furnished with modern amenities.',
    dateAdded: '2023-02-05',
    rent: 'KES 150,000/month',
    area: '180 sq.m'
  },
  {
    id: 'p4',
    name: 'Westlands Commercial Plaza',
    type: 'building',
    address: '101 Westlands Road, Nairobi',
    status: 'available',
    units: 45,
    manager: 'Leslie Alexander',
    managerId: '4',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    description: 'Prime commercial building with office spaces ranging from 30 to 200 sq.m. Features high-speed internet, backup generator, and ample parking.',
    dateAdded: '2023-04-10',
    area: '2 acres'
  },
  {
    id: 'p5',
    name: 'Garden Villa',
    type: 'house',
    address: '202 Karen Road, Nairobi',
    status: 'available',
    manager: 'Guy Hawkins',
    managerId: '5',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    description: '5-bedroom villa with garden, swimming pool, and servant quarters. Perfect for diplomatic or executive families.',
    dateAdded: '2023-01-30',
    rent: 'KES 350,000/month',
    area: '0.5 acre'
  },
  {
    id: 'p6',
    name: 'Downtown Studio Apartments',
    type: 'apartment',
    address: '303 CBD Street, Nairobi',
    status: 'under-maintenance',
    manager: 'Jane Cooper',
    managerId: '1',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80',
    description: 'Compact studio apartments ideal for young professionals. Walking distance to major business centers.',
    dateAdded: '2023-03-05',
    rent: 'KES 45,000/month',
    area: '40 sq.m'
  }
];
