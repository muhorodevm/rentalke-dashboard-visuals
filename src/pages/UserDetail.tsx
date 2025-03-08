
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Calendar, Mail, Phone, MapPin, 
  Building, Award, Shield, ArrowLeft, Edit, 
  Trash, Activity, KeyRound, ClipboardList, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

// Mock user data (expanded with more details)
const mockUserDetails = [
  { 
    id: '1', 
    name: 'Devon Lane', 
    email: 'devon@example.com', 
    role: 'admin', 
    position: 'System Administrator',
    status: 'active', 
    lastActive: '5 min ago', 
    avatar: 'https://i.pravatar.cc/150?img=1',
    department: 'IT',
    joinDate: 'January 15, 2023',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA',
    biography: 'Experienced system administrator with over 10 years in property management software.',
    permissions: ['full_access', 'user_management', 'billing_access', 'reports', 'api_access'],
    recentActivity: [
      { action: 'User Created', timestamp: '2023-01-15 09:30 AM', details: 'Created user account for Jane Cooper' },
      { action: 'Permission Modified', timestamp: '2023-02-01 02:15 PM', details: 'Updated permission set for Marketing team' },
      { action: 'System Update', timestamp: '2023-02-15 11:45 AM', details: 'Deployed system update v2.3.5' },
      { action: 'Login', timestamp: '2023-03-01 08:12 AM', details: 'Logged in from 192.168.1.105' },
      { action: 'Settings Changed', timestamp: '2023-03-10 03:22 PM', details: 'Updated notification preferences' }
    ],
    assignedProperties: [
      { id: 'p1', name: 'Sunset Gardens Estate', type: 'estate', units: 24 },
      { id: 'p4', name: 'Westlands Commercial Plaza', type: 'building', units: 45 }
    ]
  },
  { 
    id: '2', 
    name: 'Jane Cooper', 
    email: 'jane@example.com', 
    role: 'manager', 
    position: 'Property Manager',
    status: 'active', 
    lastActive: '1 hour ago', 
    avatar: 'https://i.pravatar.cc/150?img=2',
    department: 'Management',
    joinDate: 'February 3, 2023',
    phone: '+1 (555) 987-6543',
    address: '456 Manager Ave, Downtown, NY',
    biography: 'Property management professional specializing in residential high-rises and commercial spaces.',
    permissions: ['property_management', 'tenant_communication', 'maintenance_requests', 'reports_view'],
    recentActivity: [
      { action: 'Property Added', timestamp: '2023-02-10 10:15 AM', details: 'Added Green Towers property' },
      { action: 'Tenant Issue', timestamp: '2023-02-25 09:30 AM', details: 'Resolved maintenance request #RT-7823' },
      { action: 'Login', timestamp: '2023-03-01 07:45 AM', details: 'Logged in from mobile device' },
      { action: 'Report Generated', timestamp: '2023-03-15 01:30 PM', details: 'Generated quarterly revenue report' }
    ],
    assignedProperties: [
      { id: 'p2', name: 'Green Towers', type: 'building', units: 120 }
    ]
  },
  { 
    id: '3', 
    name: 'Esther Howard', 
    email: 'esther@example.com', 
    role: 'user', 
    position: 'Tenant',
    status: 'active', 
    lastActive: '3 hours ago', 
    avatar: 'https://i.pravatar.cc/150?img=3',
    department: 'Residents',
    joinDate: 'March 12, 2023',
    phone: '+1 (555) 234-5678',
    address: 'Apt 303, Riverside Apartments, River Dr',
    biography: 'Living in Riverside Apartments since March 2023. Works as a marketing executive.',
    permissions: ['profile_edit', 'payment_view', 'maintenance_request'],
    recentActivity: [
      { action: 'Rent Payment', timestamp: '2023-03-15 09:15 AM', details: 'Paid rent for April 2023 - $1,500' },
      { action: 'Maintenance Request', timestamp: '2023-03-20 02:30 PM', details: 'Submitted request for kitchen sink repair' },
      { action: 'Login', timestamp: '2023-03-25 07:15 PM', details: 'Logged in from mobile device' }
    ],
    assignedProperties: [
      { id: 'p3', name: 'Riverside Apartments', type: 'apartment', units: null }
    ]
  },
  { 
    id: '4', 
    name: 'Jenny Wilson', 
    email: 'jenny@example.com', 
    role: 'user', 
    position: 'Maintenance Staff',
    status: 'inactive', 
    lastActive: '2 days ago', 
    avatar: 'https://i.pravatar.cc/150?img=4',
    department: 'Maintenance',
    joinDate: 'January 5, 2023',
    phone: '+1 (555) 345-6789',
    address: '789 Worker St, Service District, CA',
    biography: 'Experienced maintenance professional specializing in electrical and plumbing systems.',
    permissions: ['maintenance_management', 'inventory_access', 'property_access'],
    recentActivity: [
      { action: 'Task Completed', timestamp: '2023-03-10 11:45 AM', details: 'Completed maintenance task #MT-3452' },
      { action: 'Inventory Update', timestamp: '2023-03-12 03:20 PM', details: 'Updated plumbing supplies inventory' },
      { action: 'Task Assigned', timestamp: '2023-03-15 08:30 AM', details: 'Assigned to electrical repair at Green Towers' },
      { action: 'Login', timestamp: '2023-03-15 08:35 AM', details: 'Logged in from mobile device' }
    ],
    assignedProperties: [
      { id: 'p1', name: 'Sunset Gardens Estate', type: 'estate', units: 24 },
      { id: 'p2', name: 'Green Towers', type: 'building', units: 120 }
    ]
  },
  { 
    id: '5', 
    name: 'Guy Hawkins', 
    email: 'guy@example.com', 
    role: 'user', 
    position: 'Security Guard',
    status: 'pending', 
    lastActive: 'Never', 
    avatar: 'https://i.pravatar.cc/150?img=5',
    department: 'Security',
    joinDate: 'March 25, 2023',
    phone: '+1 (555) 456-7890',
    address: '101 Security Blvd, Watchtower, CA',
    biography: 'Former military personnel with extensive experience in security operations.',
    permissions: ['security_logs', 'visitor_management', 'incident_reports'],
    recentActivity: [
      { action: 'Account Created', timestamp: '2023-03-25 10:00 AM', details: 'User account created by Devon Lane' }
    ],
    assignedProperties: [
      { id: 'p1', name: 'Sunset Gardens Estate', type: 'estate', units: 24 }
    ]
  },
];

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch from API
    setLoading(true);
    setTimeout(() => {
      const foundUser = mockUserDetails.find(u => u.id === id);
      setUser(foundUser || null);
      setLoading(false);
    }, 500);
  }, [id]);
  
  const handleDeleteUser = () => {
    toast({
      title: "User deleted",
      description: "User has been deleted successfully."
    });
    navigate('/user-management');
  };
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'inactive':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
      case 'pending':
        return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 mr-1" />;
      case 'manager':
        return <Award className="h-4 w-4 mr-1" />;
      default:
        return <User className="h-4 w-4 mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-t-2 border-primary border-solid rounded-full" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/user-management')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">User Not Found</h1>
        </div>
        <div className="text-center py-20">
          <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">User not found</h2>
          <p className="text-muted-foreground mb-4">
            The user you're looking for doesn't exist or may have been deleted.
          </p>
          <Button onClick={() => navigate('/user-management')}>
            Return to User Management
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/user-management')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete User
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  user account and remove their data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <Badge className={cn("inline-flex items-center mt-2", getRoleBadgeColor(user.role))}>
              {getRoleIcon(user.role)}
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
            <CardDescription className="mt-2">{user.position}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">{user.phone}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Address</div>
                  <div className="text-sm text-muted-foreground">{user.address}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Department</div>
                  <div className="text-sm text-muted-foreground">{user.department}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Joined</div>
                  <div className="text-sm text-muted-foreground">{user.joinDate}</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm font-medium mb-1">Status</div>
                <Badge className={cn("w-full justify-center py-1.5", getStatusColor(user.status))}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full">
              <KeyRound className="h-4 w-4 mr-2" />
              Reset Password
            </Button>
          </CardFooter>
        </Card>
        
        {/* User Details Tabs */}
        <Card className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <CardHeader className="pb-0">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="pt-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Biography</h3>
                  <p className="text-muted-foreground">{user.biography}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Assigned Properties</h3>
                  {user.assignedProperties.length === 0 ? (
                    <p className="text-muted-foreground">No properties assigned</p>
                  ) : (
                    <div className="space-y-3">
                      {user.assignedProperties.map((property: any) => (
                        <Card key={property.id} className="overflow-hidden">
                          <div className="flex items-center p-4">
                            <Building className="h-8 w-8 mr-4 text-primary" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{property.name}</h4>
                              <p className="text-sm text-muted-foreground capitalize">
                                {property.type} {property.units ? `• ${property.units} units` : ''}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`/properties/${property.id}`}>
                                View
                              </a>
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4">
                <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
                <div className="space-y-4">
                  {user.recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="relative pl-6 pb-4">
                      <div className="absolute left-0 top-0 h-full w-px bg-border" />
                      <div className="absolute left-[-4px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                      <div className="mb-1">
                        <span className="font-medium">{activity.action}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Permissions Tab */}
              <TabsContent value="permissions" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">User Permissions</h3>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Permissions
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {user.permissions.map((permission: string) => (
                    <div 
                      key={permission}
                      className="flex items-center gap-2 p-3 border rounded-lg"
                    >
                      <Lock className="h-4 w-4 text-primary" />
                      <span className="capitalize">{permission.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default UserDetail;
