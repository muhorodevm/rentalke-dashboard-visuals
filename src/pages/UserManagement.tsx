import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { 
  Search, Filter, Plus, MoreHorizontal, UserPlus, Download, 
  Trash2, Shield, UserX, Mail, Key, User, Users, CheckSquare, Loader2
} from "lucide-react";

interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "CLIENT";
  status: "Active" | "Inactive" | "Pending";
  department?: string;
  position?: string;
  lastLogin?: string;
  profileImage?: string;
}

const ADMIN_POSITIONS = ["CEO", "CTO", "COO", "Other"];
const DEPARTMENTS = ["Executive", "IT", "Operations", "Marketing", "Finance", "HR", "Sales", "Support"];

const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const { getToken, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [newUserData, setNewUserData] = useState<Partial<UserType>>({
    firstName: "",
    lastName: "",
    email: "",
    role: "CLIENT",
    status: "Active",
    department: "",
    position: ""
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserType["role"]>("CLIENT");
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const filteredUsers = users.filter((user) => {
    if (selectedTab !== "all" && user.role.toLowerCase() !== selectedTab.toLowerCase()) {
      return false;
    }
    
    if (
      searchQuery &&
      !`${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await axios.get("https://rentalke-server-2.onrender.com/api/v1/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const formattedUsers = response.data.map((user: any) => ({
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        role: user.role,
        status: user.isActive ? "Active" : "Inactive",
        department: user.department || '',
        position: user.position || '',
        lastLogin: user.lastLogin || 'Never',
        profileImage: user.profileImage
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canModifyUser = (targetUser: UserType) => {
    if (!currentUser) return false;
    
    if (currentUser.position === "CEO") return true;
    
    if ((currentUser.position === "CTO" || currentUser.position === "COO") && 
        targetUser.position !== "CEO") {
      return true;
    }
    
    if (currentUser.role === "ADMIN" && targetUser.role !== "ADMIN") {
      return true;
    }
    
    return false;
  };

  const handleAddUser = async () => {
    if (!newUserData.firstName || !newUserData.lastName || !newUserData.email) {
      toast({
        title: "Missing Information",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const token = getToken();
      const response = await axios.post("https://rentalke-server-2.onrender.com/api/v1/admin/users", {
        firstName: newUserData.firstName,
        lastName: newUserData.lastName,
        email: newUserData.email,
        role: newUserData.role,
        department: newUserData.department,
        position: newUserData.role === "ADMIN" ? newUserData.position : undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newUser = response.data;
      setUsers([...users, {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        status: "Active",
        department: newUser.department || '',
        position: newUser.position || '',
        lastLogin: 'Never'
      }]);
      
      setNewUserData({
        firstName: "",
        lastName: "",
        email: "",
        role: "CLIENT",
        status: "Active",
        department: "",
        position: ""
      });
      
      setIsAddUserOpen(false);
      toast({
        title: "User Added",
        description: `${newUser.firstName} ${newUserData.lastName} has been added as a ${newUserData.role}.`,
      });
    } catch (error: any) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add user. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const token = getToken();
      await axios.delete(`https://rentalke-server-2.onrender.com/api/v1/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.filter((user) => user.id !== id));
      toast({
        title: "User Deleted",
        description: "The user has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUserRole = async (id: string, newRole: UserType["role"]) => {
    try {
      const token = getToken();
      await axios.patch(`https://rentalke-server-2.onrender.com/api/v1/admin/users/${id}/role`, {
        role: newRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, role: newRole } : user
        )
      );
      toast({
        title: "Role Updated",
        description: `User role has been updated to ${newRole}.`,
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUserStatus = async (id: string, newStatus: UserType["status"]) => {
    try {
      const token = getToken();
      await axios.patch(`https://rentalke-server-2.onrender.com/api/v1/admin/users/${id}/status`, {
        status: newStatus === "Active"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );
      toast({
        title: "Status Updated",
        description: `User status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleBulkAction = async (action: 'delete' | 'activate' | 'deactivate') => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select users to perform this action.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = getToken();
      
      switch (action) {
        case 'delete':
          await Promise.all(selectedUsers.map(id => 
            axios.delete(`https://rentalke-server-2.onrender.com/api/v1/admin/users/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          ));
          setUsers(users.filter(user => !selectedUsers.includes(user.id)));
          toast({
            title: "Bulk Action Completed",
            description: "Selected users have been deleted",
          });
          break;
          
        case 'activate':
          await Promise.all(selectedUsers.map(id => 
            axios.patch(`https://rentalke-server-2.onrender.com/api/v1/admin/users/${id}/status`, {
              status: true
            }, {
              headers: { Authorization: `Bearer ${token}` }
            })
          ));
          setUsers(users.map(user => 
            selectedUsers.includes(user.id) ? {...user, status: "Active"} : user
          ));
          toast({
            title: "Bulk Action Completed",
            description: "Selected users have been activated",
          });
          break;
          
        case 'deactivate':
          await Promise.all(selectedUsers.map(id => 
            axios.patch(`https://rentalke-server-2.onrender.com/api/v1/admin/users/${id}/status`, {
              status: false
            }, {
              headers: { Authorization: `Bearer ${token}` }
            })
          ));
          setUsers(users.map(user => 
            selectedUsers.includes(user.id) ? {...user, status: "Inactive"} : user
          ));
          toast({
            title: "Bulk Action Completed",
            description: "Selected users have been deactivated",
          });
          break;
      }
      
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const changeMultipleUserRoles = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select users to change their roles.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = getToken();
      await Promise.all(selectedUsers.map(id => 
        axios.patch(`https://rentalke-server-2.onrender.com/api/v1/admin/users/${id}/role`, {
          role: selectedRole
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));
      
      const newUsers = users.map(user => 
        selectedUsers.includes(user.id) ? {...user, role: selectedRole} : user
      );
      
      setUsers(newUsers);
      setSelectedUsers([]);
      setIsRoleDialogOpen(false);
      
      toast({
        title: "Roles Updated",
        description: `${selectedUsers.length} users have been updated to ${selectedRole} role.`,
      });
    } catch (error) {
      console.error("Error updating roles:", error);
      toast({
        title: "Error",
        description: "Failed to update user roles. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage all users, clients and admin of your system
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage all users in the system
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Create a new user account for your platform.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <label htmlFor="firstName">First Name</label>
                            <Input
                              id="firstName"
                              placeholder="John"
                              value={newUserData.firstName || ""}
                              onChange={(e) =>
                                setNewUserData({
                                  ...newUserData,
                                  firstName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="lastName">Last Name</label>
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              value={newUserData.lastName || ""}
                              onChange={(e) =>
                                setNewUserData({
                                  ...newUserData,
                                  lastName: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="email">Email</label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={newUserData.email || ""}
                            onChange={(e) =>
                              setNewUserData({
                                ...newUserData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="role">Role</label>
                          <Select
                            onValueChange={(value) =>
                              setNewUserData({
                                ...newUserData,
                                role: value as UserType["role"],
                              })
                            }
                            defaultValue={newUserData.role}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="MANAGER">Manager</SelectItem>
                              <SelectItem value="CLIENT">Client</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {newUserData.role === "ADMIN" && (
                          <>
                            <div className="grid gap-2">
                              <label htmlFor="position">Position</label>
                              <Select
                                onValueChange={(value) =>
                                  setNewUserData({
                                    ...newUserData,
                                    position: value,
                                  })
                                }
                                defaultValue={newUserData.position}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ADMIN_POSITIONS.map((position) => (
                                    <SelectItem key={position} value={position}>
                                      {position}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                        
                        <div className="grid gap-2">
                          <label htmlFor="department">Department</label>
                          <Select
                            onValueChange={(value) =>
                              setNewUserData({
                                ...newUserData,
                                department: value,
                              })
                            }
                            defaultValue={newUserData.department}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {DEPARTMENTS.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddUser} disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            "Add User"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change User Roles</DialogTitle>
                        <DialogDescription>
                          Change roles for all selected users
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="grid gap-2">
                          <label htmlFor="bulk-role">New Role</label>
                          <Select
                            onValueChange={(value) => setSelectedRole(value as UserType["role"])}
                            defaultValue={selectedRole}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="MANAGER">Manager</SelectItem>
                              <SelectItem value="CLIENT">Client</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={changeMultipleUserRoles}>Apply Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    {selectedUsers.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Bulk Actions ({selectedUsers.length})
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setIsRoleDialogOpen(true)}>
                            <Shield className="h-4 w-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                            <User className="h-4 w-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                            <UserX className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="all" onValueChange={setSelectedTab}>
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="all">
                      <Users className="h-4 w-4 mr-2" />
                      All ({users.length})
                    </TabsTrigger>
                    <TabsTrigger value="admin">
                      <Shield className="h-4 w-4 mr-2" />
                      Admins ({users.filter(u => u.role === "ADMIN").length})
                    </TabsTrigger>
                    <TabsTrigger value="manager">
                      <User className="h-4 w-4 mr-2" />
                      Managers ({users.filter(u => u.role === "MANAGER").length})
                    </TabsTrigger>
                    <TabsTrigger value="client">
                      <Users className="h-4 w-4 mr-2" />
                      Clients ({users.filter(u => u.role === "CLIENT").length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="pt-2">
                    <Card>
                      {isLoading ? (
                        <div className="flex justify-center items-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="ml-2">Loading users...</span>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">
                                <Checkbox 
                                  checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                  onCheckedChange={handleSelectAllUsers}
                                />
                              </TableHead>
                              <TableHead>User</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Department</TableHead>
                              <TableHead>Position</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Last Login</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                  No users found. Try adjusting your filters.
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                  <TableCell>
                                    <Checkbox 
                                      checked={selectedUsers.includes(user.id)}
                                      onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <Avatar>
                                        <AvatarImage src={user.profileImage} />
                                        <AvatarFallback>
                                          {`${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {user.email}
                                        </p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={`
                                        ${user.role === "ADMIN" ? "border-blue-200 bg-blue-50 text-blue-700" : ""}
                                        ${user.role === "MANAGER" ? "border-purple-200 bg-purple-50 text-purple-700" : ""}
                                        ${user.role === "CLIENT" ? "border-green-200 bg-green-50 text-green-700" : ""}
                                      `}
                                    >
                                      {user.role}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{user.department || '-'}</TableCell>
                                  <TableCell>{user.position || '-'}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={`
                                        ${user.status === "Active" ? "border-green-200 bg-green-50 text-green-700" : ""}
                                        ${user.status === "Inactive" ? "border-gray-200 bg-gray-50 text-gray-700" : ""}
                                        ${user.status === "Pending" ? "border-yellow-200 bg-yellow-50 text-yellow-700" : ""}
                                      `}
                                    >
                                      {user.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{user.lastLogin}</TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => {
                                          toast({
                                            title: "Email Sent",
                                            description: `An email has been sent to ${user.firstName} ${user.lastName}.`,
                                          });
                                        }}>
                                          <Mail className="h-4 w-4 mr-2" />
                                          Send Email
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                          toast({
                                            title: "Password Reset",
                                            description: `Password reset link sent to ${user.firstName} ${user.lastName}.`,
                                          });
                                        }}>
                                          <Key className="h-4 w-4 mr-2" />
                                          Reset Password
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {canModifyUser(user) && (
                                          <>
                                            <DropdownMenuItem onClick={() => {
                                              const newRole: UserType["role"] = 
                                                user.role === "ADMIN" ? "MANAGER" : 
                                                user.role === "MANAGER" ? "CLIENT" : "MANAGER";
                                              handleUpdateUserRole(user.id, newRole);
                                            }}>
                                              <Shield className="h-4 w-4 mr-2" />
                                              Change Role
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                              const newStatus: UserType["status"] = 
                                                user.status === "Active" ? "Inactive" : "Active";
                                              handleUpdateUserStatus(user.id, newStatus);
                                            }}>
                                              {user.status === "Active" ? (
                                                <>
                                                  <UserX className="h-4 w-4 mr-2" />
                                                  Deactivate
                                                </>
                                              ) : (
                                                <>
                                                  <User className="h-4 w-4 mr-2" />
                                                  Activate
                                                </>
                                              )}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem 
                                              className="text-red-600"
                                              onClick={() => handleDeleteUser(user.id)}
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete
                                            </DropdownMenuItem>
                                          </>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      )}
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="admin">
                    {/* Admin tab content - table with filtered users */}
                  </TabsContent>
                  
                  <TabsContent value="manager">
                    {/* Manager tab content - table with filtered users */}
                  </TabsContent>
                  
                  <TabsContent value="client">
                    {/* Client tab content - table with filtered users */}
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              {/* Pagination could be added here */}
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserManagement;
