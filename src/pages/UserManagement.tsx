
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  UserPlus,
  Users,
  User,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  UserCog,
  UserCheck,
  Save,
  Loader2,
  X
} from 'lucide-react';

// Define User interface
interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  position: string | null;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

// Admin positions enum
type AdminPosition = 'CEO' | 'CTO' | 'COO' | 'Other';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // New user form state
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'CLIENT', // Default role
    department: '',
    position: '',
    password: '',
    confirmPassword: ''
  });
  
  // Get auth context and API base URL
  const { toast } = useToast();
  const { getToken, user: currentUser } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://rentalke-server-2.onrender.com/api/v1";
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Filter users when tab, search query, or users changes
  useEffect(() => {
    filterUsers();
  }, [activeTab, searchQuery, users]);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterUsers = () => {
    let filtered = [...users];
    
    // Filter by role if not on 'all' tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(user => user.role === activeTab.toUpperCase());
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query) ||
        user.department?.toLowerCase().includes(query) ||
        user.position?.toLowerCase().includes(query)
      );
    }
    
    setFilteredUsers(filtered);
  };
  
  const handleAddUser = async () => {
    // Validate form
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const token = getToken();
      const response = await axios.post(`${API_BASE_URL}/admin/users`, {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        department: newUser.department,
        position: newUser.position,
        password: newUser.password,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Add new user to list
      setUsers([...users, response.data.user]);
      
      // Reset form and close dialog
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'CLIENT',
        department: '',
        position: '',
        password: '',
        confirmPassword: ''
      });
      
      setShowAddUserDialog(false);
      
      toast({
        title: "Success",
        description: "User created successfully.",
      });
    } catch (error: any) {
      console.error("Error creating user:", error);
      const errorMessage = error.response?.data?.message || "Failed to create user. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    setIsSaving(true);
    try {
      const token = getToken();
      const response = await axios.put(`${API_BASE_URL}/admin/users/${editingUser.id}`, {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        department: editingUser.department,
        position: editingUser.position,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update user in list
      setUsers(users.map(user => 
        user.id === editingUser.id ? response.data.user : user
      ));
      
      // Reset form and close dialog
      setEditingUser(null);
      setShowEditUserDialog(false);
      
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating user:", error);
      const errorMessage = error.response?.data?.message || "Failed to update user. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove user from list
      setUsers(users.filter(user => user.id !== userId));
      
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete user. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };
  
  const getUserFullName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.lastName) {
      return user.lastName;
    } else {
      return 'Unnamed User';
    }
  };
  
  const getUserInitials = (user: User) => {
    let initials = '';
    if (user.firstName) initials += user.firstName[0];
    if (user.lastName) initials += user.lastName[0];
    return initials.toUpperCase() || 'U';
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Check if current user is CEO
  const isCurrentUserCEO = () => {
    return currentUser?.role === 'ADMIN' && currentUser?.position === 'CEO';
  };
  
  // Check if user can be edited by current user
  const canEditUser = (user: User) => {
    // CEO can edit everyone
    if (isCurrentUserCEO()) return true;
    
    // Non-CEO admin can't edit CEO
    if (user.role === 'ADMIN' && user.position === 'CEO') return false;
    
    // Non-CEO admin can edit other admins and regular users
    return true;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and their access to the system
          </p>
        </div>
        <Button onClick={() => setShowAddUserDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
            <TabsTrigger value="manager">Managers</TabsTrigger>
            <TabsTrigger value="client">Clients</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* User List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center p-6">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-1">No Users Found</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery
                  ? "No users match your search criteria."
                  : "There are no users to display."}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowAddUserDialog(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)] rounded-md">
              <div className="p-1">
                {filteredUsers.map((user) => (
                  <div 
                    key={user.id}
                    className="p-4 hover:bg-muted rounded-lg transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.profileImage || undefined} alt={getUserFullName(user)} />
                        <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{getUserFullName(user)}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="hidden md:block">
                        <div className="text-sm font-medium">{user.role}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.position ? `${user.position}${user.department ? ` · ${user.department}` : ''}` : 'No position'}
                        </div>
                      </div>
                      
                      <div className="hidden md:block text-sm text-muted-foreground">
                        Joined {formatDate(user.createdAt)}
                      </div>
                      
                      <div className="flex gap-2">
                        {canEditUser(user) && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEditingUser(user);
                                setShowEditUserDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.id === currentUser?.id} // Can't delete yourself
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      
      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account in the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">Client</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    {isCurrentUserCEO() && (
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {newUser.role === 'ADMIN' && (
                <div className="space-y-2">
                  <Label htmlFor="position">Admin Position</Label>
                  <Select 
                    value={newUser.position} 
                    onValueChange={(value) => setNewUser({...newUser, position: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Only CEO can create another CEO */}
                      {isCurrentUserCEO() && (
                        <SelectItem value="CEO">CEO</SelectItem>
                      )}
                      <SelectItem value="CTO">CTO</SelectItem>
                      <SelectItem value="COO">COO</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={newUser.department}
                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddUserDialog(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddUser}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and permissions.
            </DialogDescription>
          </DialogHeader>
          
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">First Name</Label>
                  <Input
                    id="edit-firstName"
                    value={editingUser.firstName || ''}
                    onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Last Name</Label>
                  <Input
                    id="edit-lastName"
                    value={editingUser.lastName || ''}
                    onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select 
                    value={editingUser.role} 
                    onValueChange={(value) => setEditingUser({...editingUser, role: value})}
                    disabled={editingUser.id === currentUser?.id} // Can't change your own role
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENT">Client</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {editingUser.role === 'ADMIN' && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-position">Admin Position</Label>
                    <Select 
                      value={editingUser.position || ''}
                      onValueChange={(value) => setEditingUser({...editingUser, position: value})}
                      disabled={!isCurrentUserCEO() && editingUser.position === 'CEO'} // Only CEO can edit CEO position
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {isCurrentUserCEO() && (
                          <SelectItem value="CEO">CEO</SelectItem>
                        )}
                        <SelectItem value="CTO">CTO</SelectItem>
                        <SelectItem value="COO">COO</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={editingUser.department || ''}
                  onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowEditUserDialog(false);
                setEditingUser(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateUser}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
