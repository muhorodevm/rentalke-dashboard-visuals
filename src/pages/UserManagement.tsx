
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUsers, User } from '@/context/UserContext';
import {
  Search, Filter, MoreHorizontal, PlusCircle, Trash, UserRound,
  BadgeCheck, Users, ShieldCheck, RefreshCw, Database, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type UserStatus = 'active' | 'inactive' | 'pending';

// User form schema
const userFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'manager', 'user'], {
    required_error: 'Please select a role',
  }),
  position: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending'], {
    required_error: 'Please select a status',
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// Loading skeleton for the user table
const UserTableSkeleton = () => (
  <div className="border rounded-md overflow-hidden">
    <div className="bg-muted/50 p-4">
      <Skeleton className="h-8 w-full max-w-[250px]" />
    </div>
    <div className="p-4 space-y-3">
      {Array(5).fill(0).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-8 w-[100px]" />
        </div>
      ))}
    </div>
  </div>
);

const UserManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { users, loading, error, fetchUsers, clearCache } = useUsers();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      position: '',
      department: '',
      status: 'pending',
    }
  });
  
  // Handle refreshing users list with force refresh option
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchUsers(true); // Force refresh from API
      toast({
        title: "Users refreshed",
        description: "User list has been updated from the server.",
      });
    } catch (error) {
      console.error("Error refreshing users:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchUsers, toast]);
  
  // Handle clearing the cache
  const handleClearCache = useCallback(() => {
    clearCache();
    handleRefresh();
  }, [clearCache, handleRefresh]);
  
  // Update filtered users when users or filters change
  useEffect(() => {
    if (!users || users.length === 0) {
      setFilteredUsers([]);
      return;
    }
    
    let result = [...users];
    
    // Search filter
    if (searchTerm) {
      result = result.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.position && user.position.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter]);
  
  const handleDeleteUser = async (id: string) => {
    try {
      // Call the API to delete the user
      // await adminApi.deleteUser(id);
      // For now just refresh the list
      await fetchUsers(true);
      setSelectedUsers(prevSelected => prevSelected.filter(userId => userId !== id));
      
      toast({
        title: "User deleted",
        description: "User has been deleted successfully."
      });
      
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error deleting user",
        description: "An error occurred while trying to delete the user.",
        variant: "destructive"
      });
    }
  };
  
  const handleMultiDelete = async () => {
    try {
      // Here would typically be an API call to delete multiple users
      // For now, we'll just refresh the users list
      await fetchUsers(true);
      setSelectedUsers([]);
      
      toast({
        title: `${selectedUsers.length} users deleted`,
        description: "Users have been deleted successfully."
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting multiple users:", error);
      toast({
        title: "Error deleting users",
        description: "An error occurred while trying to delete users.",
        variant: "destructive"
      });
    }
  };
  
  const toggleUserSelection = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) 
        ? prev.filter(userId => userId !== id) 
        : [...prev, id]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };
  
  const onSubmit = async (data: UserFormValues) => {
    try {
      // Here you would typically make an API call to create the user
      console.log("Creating new user:", data);
      
      // Then refresh the list
      await fetchUsers(true);
      
      toast({
        title: "User created",
        description: "New user has been created successfully."
      });
      
      setIsAddUserDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error creating user",
        description: "An error occurred while trying to create the user.",
        variant: "destructive"
      });
    }
  };

  const handleViewUser = (userId: string) => {
    navigate(`/user-management/${userId}`);
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
  
  const getStatusColor = (status: UserStatus) => {
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
        return <ShieldCheck className="h-4 w-4 mr-1" />;
      case 'manager':
        return <BadgeCheck className="h-4 w-4 mr-1" />;
      default:
        return <UserRound className="h-4 w-4 mr-1" />;
    }
  };
  
  // Render empty state for no users
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium mb-1">No users found</h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
          ? "Try adjusting your filters or search terms" 
          : "No users have been added yet"}
      </p>
      {!(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-1" />
          Add First User
        </Button>
      )}
    </div>
  );
  
  // Render error state
  const renderErrorState = () => (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center text-center max-w-md">
        <p className="text-red-500 font-semibold mb-2">Error loading users</p>
        <p className="text-muted-foreground mb-4">
          {error || "An error occurred while trying to load users. Please try again."}
        </p>
        <div className="flex gap-3">
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" onClick={handleClearCache}>
            <Database className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage user accounts, roles, and permissions.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 space-y-4">
          {/* Action bar */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Role</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Status</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              {selectedUsers.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete ({selectedUsers.length})
                </Button>
              )}
              
              <Button onClick={() => setIsAddUserDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Add User
              </Button>
            </div>
          </div>
          
          {/* Loading state */}
          {loading && <UserTableSkeleton />}
          
          {/* Error state */}
          {!loading && error && renderErrorState()}
          
          {/* Empty state */}
          {!loading && !error && filteredUsers.length === 0 && renderEmptyState()}
          
          {/* User table */}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="border rounded-md overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead className="min-w-[180px]">Name</TableHead>
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Active</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className="cursor-pointer hover:bg-muted/70"
                      onClick={() => handleViewUser(user.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                          aria-label={`Select ${user.firstName} ${user.lastName}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.profileImage} />
                            <AvatarFallback>
                              {user.firstName.substring(0, 1).toUpperCase() + user.lastName.substring(0, 1).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge className={cn("flex items-center gap-1 px-2 py-1 capitalize font-normal", getRoleBadgeColor(user.role))}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge className={cn("capitalize font-normal", getStatusColor(user.status))}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                        </span>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleViewUser(user.id);
                            }}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              // Edit user functionality would go here
                            }}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUserToDelete(user.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {selectedUsers.length > 0 && !userToDelete
                ? `Are you sure you want to delete ${selectedUsers.length} selected users? This action cannot be undone.`
                : "Are you sure you want to delete this user? This action cannot be undone."
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setUserToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (userToDelete) {
                  handleDeleteUser(userToDelete);
                } else {
                  handleMultiDelete();
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. The user will receive an email to set their password.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Property Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Management" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setIsAddUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
