
import React, { useState } from "react";
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
import { 
  Search, Filter, Plus, MoreHorizontal, UserPlus, Download, 
  Trash2, Shield, UserX, Mail, Key, User, Users, CheckSquare 
} from "lucide-react";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Client";
  status: "Active" | "Inactive" | "Pending";
  lastLogin?: string;
  avatar?: string;
}

const DEMO_USERS: UserType[] = [
  {
    id: 1,
    name: "Jane Cooper",
    email: "jane@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "Today, 2:30 PM",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Esther Howard",
    email: "esther@example.com",
    role: "Manager",
    status: "Active",
    lastLogin: "Yesterday, 10:15 AM",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Darlene Robertson",
    email: "darlene@example.com",
    role: "Manager",
    status: "Inactive",
    lastLogin: "May 20, 2023",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Jenny Wilson",
    email: "jenny@example.com",
    role: "Client",
    status: "Active",
    lastLogin: "Today, 9:00 AM",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Robert Fox",
    email: "robert@example.com",
    role: "Client",
    status: "Pending",
    lastLogin: "Never",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Wade Warren",
    email: "wade@example.com",
    role: "Client",
    status: "Active",
    lastLogin: "May 28, 2023",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 7,
    name: "Leslie Alexander",
    email: "leslie@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "Today, 11:20 AM",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: 8,
    name: "Ralph Edwards",
    email: "ralph@example.com",
    role: "Manager",
    status: "Active",
    lastLogin: "Yesterday, 3:40 PM",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
];

const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserType[]>(DEMO_USERS);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [newUserData, setNewUserData] = useState<Partial<UserType>>({
    name: "",
    email: "",
    role: "Client",
    status: "Active",
  });
  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserType["role"]>("Client");
  const [selectedTab, setSelectedTab] = useState<string>("all");

  // Filter users based on selected tab and search query
  const filteredUsers = users.filter((user) => {
    // Filter by tab/role
    if (selectedTab !== "all" && user.role.toLowerCase() !== selectedTab) {
      return false;
    }
    
    // Filter by search query
    if (
      searchQuery &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });

  const handleAddUser = () => {
    if (!newUserData.name || !newUserData.email) {
      toast({
        title: "Missing Information",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    const newUser: UserType = {
      id: users.length + 1,
      name: newUserData.name as string,
      email: newUserData.email as string,
      role: newUserData.role as UserType["role"] || "Client",
      status: newUserData.status as UserType["status"] || "Active",
      lastLogin: "Never",
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };

    setUsers([...users, newUser]);
    setNewUserData({
      name: "",
      email: "",
      role: "Client",
      status: "Active",
    });
    setIsAddUserOpen(false);

    toast({
      title: "User Added",
      description: `${newUser.name} has been added as a ${newUser.role}.`,
    });
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
    toast({
      title: "User Deleted",
      description: "The user has been deleted successfully.",
    });
  };

  const handleUpdateUserRole = (id: number, newRole: UserType["role"]) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole}.`,
    });
  };

  const handleUpdateUserStatus = (id: number, newStatus: UserType["status"]) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
    toast({
      title: "Status Updated",
      description: `User status has been updated to ${newStatus}.`,
    });
  };

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleBulkAction = (action: 'delete' | 'activate' | 'deactivate') => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select users to perform this action.",
        variant: "destructive",
      });
      return;
    }

    let newUsers = [...users];
    let actionMessage = "";

    switch (action) {
      case 'delete':
        newUsers = users.filter(user => !selectedUsers.includes(user.id));
        actionMessage = "Selected users have been deleted";
        break;
      case 'activate':
        newUsers = users.map(user => 
          selectedUsers.includes(user.id) ? {...user, status: "Active"} : user
        );
        actionMessage = "Selected users have been activated";
        break;
      case 'deactivate':
        newUsers = users.map(user => 
          selectedUsers.includes(user.id) ? {...user, status: "Inactive"} : user
        );
        actionMessage = "Selected users have been deactivated";
        break;
    }

    setUsers(newUsers);
    setSelectedUsers([]);
    toast({
      title: "Bulk Action Completed",
      description: actionMessage,
    });
  };

  const changeMultipleUserRoles = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select users to change their roles.",
        variant: "destructive",
      });
      return;
    }

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
  };

  // Animation variants
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
                        <div className="grid gap-2">
                          <label htmlFor="name">Full Name</label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={newUserData.name || ""}
                            onChange={(e) =>
                              setNewUserData({
                                ...newUserData,
                                name: e.target.value,
                              })
                            }
                          />
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
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Manager">Manager</SelectItem>
                              <SelectItem value="Client">Client</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="status">Status</label>
                          <Select
                            onValueChange={(value) =>
                              setNewUserData({
                                ...newUserData,
                                status: value as UserType["status"],
                              })
                            }
                            defaultValue={newUserData.status}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddUser}>Add User</Button>
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
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Manager">Manager</SelectItem>
                              <SelectItem value="Client">Client</SelectItem>
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
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
                      Admins ({users.filter(u => u.role === "Admin").length})
                    </TabsTrigger>
                    <TabsTrigger value="manager">
                      <User className="h-4 w-4 mr-2" />
                      Managers ({users.filter(u => u.role === "Manager").length})
                    </TabsTrigger>
                    <TabsTrigger value="client">
                      <Users className="h-4 w-4 mr-2" />
                      Clients ({users.filter(u => u.role === "Client").length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="pt-2">
                    <Card>
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
                            <TableHead>Status</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                                      <AvatarImage src={user.avatar} />
                                      <AvatarFallback>
                                        {user.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{user.name}</p>
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
                                      ${user.role === "Admin" ? "border-blue-200 bg-blue-50 text-blue-700" : ""}
                                      ${user.role === "Manager" ? "border-purple-200 bg-purple-50 text-purple-700" : ""}
                                      ${user.role === "Client" ? "border-green-200 bg-green-50 text-green-700" : ""}
                                    `}
                                  >
                                    {user.role}
                                  </Badge>
                                </TableCell>
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
                                          description: `An email has been sent to ${user.name}.`,
                                        });
                                      }}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Send Email
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        toast({
                                          title: "Password Reset",
                                          description: `Password reset link sent to ${user.name}.`,
                                        });
                                      }}>
                                        <Key className="h-4 w-4 mr-2" />
                                        Reset Password
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => {
                                        const newRole: UserType["role"] = 
                                          user.role === "Admin" ? "Manager" : 
                                          user.role === "Manager" ? "Client" : "Manager";
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
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="admin">
                    {/* Admin tab content - Using the same table structure as the "all" tab */}
                  </TabsContent>
                  
                  <TabsContent value="manager">
                    {/* Manager tab content - Using the same table structure as the "all" tab */}
                  </TabsContent>
                  
                  <TabsContent value="client">
                    {/* Client tab content - Using the same table structure as the "all" tab */}
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
