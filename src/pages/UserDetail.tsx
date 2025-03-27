
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
import { useUsers, User as UserType } from '@/context/UserContext';
import { adminApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// Define types for user details from the API
interface UserActivity {
  action: string;
  timestamp: string;
  details: string;
}

interface AssignedProperty {
  id: string;
  name: string;
  type: string;
  units?: number | null;
}

interface UserDetails extends UserType {
  position?: string;
  department?: string;
  phone?: string;
  address?: string;
  biography?: string;
  joinDate?: string;
  permissions?: string[];
  recentActivity?: UserActivity[];
  assignedProperties?: AssignedProperty[];
}

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { users } = useUsers();
  const { getToken } = useAuth();
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        
        // First check if user exists in the context
        const contextUser = users.find(u => u.id === id);
        
        if (contextUser) {
          // If user exists in context, use it as base data
          const userDetails: UserDetails = {
            ...contextUser,
            position: contextUser.position || 'Not specified',
            department: contextUser.department || 'Not specified',
            // Add default values for other fields
            phone: 'Not specified',
            address: 'Not specified',
            biography: 'No biography available',
            joinDate: new Date(contextUser.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            permissions: ['profile_view'],
            recentActivity: [],
            assignedProperties: []
          };
          
          // Try to get additional details from API
          try {
            const token = getToken();
            if (token) {
              const response = await adminApi.getUserById(id || '');
              
              // Merge the API response with the base data
              if (response.data) {
                const apiData = response.data;
                Object.assign(userDetails, {
                  phone: apiData.phone || userDetails.phone,
                  address: apiData.address || userDetails.address,
                  biography: apiData.biography || userDetails.biography,
                  permissions: apiData.permissions || userDetails.permissions,
                  recentActivity: apiData.recentActivity || [],
                  assignedProperties: apiData.assignedProperties || []
                });
              }
            }
          } catch (error) {
            console.error('Error fetching additional user details:', error);
            // We already have basic user data, so we don't need to show an error toast
          }
          
          setUser(userDetails);
        } else {
          // If user doesn't exist in context, try to fetch directly from API
          try {
            const token = getToken();
            if (token) {
              const response = await adminApi.getUserById(id || '');
              
              if (response.data) {
                const apiData = response.data;
                
                // Format the API data into our UserDetails format
                const userDetails: UserDetails = {
                  id: apiData._id || apiData.id || '',
                  firstName: apiData.firstName || (apiData.name ? apiData.name.split(' ')[0] : ''),
                  lastName: apiData.lastName || (apiData.name ? apiData.name.split(' ')[1] || '' : ''),
                  email: apiData.email || '',
                  role: apiData.role || 'user',
                  status: apiData.status || 'pending',
                  position: apiData.position || 'Not specified',
                  department: apiData.department || 'Not specified',
                  profileImage: apiData.profileImage || apiData.avatar || '',
                  lastLogin: apiData.lastLogin || null,
                  createdAt: apiData.createdAt || new Date().toISOString(),
                  phone: apiData.phone || 'Not specified',
                  address: apiData.address || 'Not specified',
                  biography: apiData.biography || 'No biography available',
                  joinDate: new Date(apiData.createdAt || Date.now()).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }),
                  permissions: apiData.permissions || ['profile_view'],
                  recentActivity: apiData.recentActivity || [],
                  assignedProperties: apiData.assignedProperties || []
                };
                
                setUser(userDetails);
              } else {
                setUser(null);
                toast({
                  title: "User not found",
                  description: "Could not find user details",
                  variant: "destructive"
                });
              }
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
            setUser(null);
            toast({
              title: "Error fetching user",
              description: "There was an error loading the user details.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('Error in user details flow:', error);
        setUser(null);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, [id, users, toast, getToken]);
  
  const handleDeleteUser = async () => {
    try {
      // In a real app, you would call an API to delete the user
      // await adminApi.deleteUser(id);
      
      toast({
        title: "User deleted",
        description: "User has been deleted successfully."
      });
      navigate('/user-management');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
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
          <h1 className="text-3xl font-bold tracking-tight">{user.firstName} {user.lastName}</h1>
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
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="text-2xl">
                  {user.firstName?.substring(0, 1)?.toUpperCase()}{user.lastName?.substring(0, 1)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{user.firstName} {user.lastName}</CardTitle>
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
                  {!user.assignedProperties || user.assignedProperties.length === 0 ? (
                    <p className="text-muted-foreground">No properties assigned</p>
                  ) : (
                    <div className="space-y-3">
                      {user.assignedProperties.map((property: AssignedProperty) => (
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
                  {!user.recentActivity || user.recentActivity.length === 0 ? (
                    <p className="text-muted-foreground">No recent activity</p>
                  ) : (
                    user.recentActivity.map((activity: UserActivity, index: number) => (
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
                    ))
                  )}
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
                  {!user.permissions || user.permissions.length === 0 ? (
                    <p className="text-muted-foreground">No permissions assigned</p>
                  ) : (
                    user.permissions.map((permission: string) => (
                      <div 
                        key={permission}
                        className="flex items-center gap-2 p-3 border rounded-lg"
                      >
                        <Lock className="h-4 w-4 text-primary" />
                        <span className="capitalize">{permission.replace(/_/g, ' ')}</span>
                      </div>
                    ))
                  )}
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
