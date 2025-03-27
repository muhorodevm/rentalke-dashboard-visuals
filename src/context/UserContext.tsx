
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define TypeScript interfaces for the user data structure
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  position?: string;
  department?: string;
  profileImage?: string;
  lastLogin?: string;
  createdAt: string;
}

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  logUsers: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await axios.get('https://rentalke-server-kmrj.onrender.com/api/v1/admin/all/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Fetched Users API Response:', response.data);
      
      // Map the API response to our User interface
      // Handle different possible response structures
      let mappedUsers: User[] = [];
      
      if (Array.isArray(response.data)) {
        // If response.data is already an array
        mappedUsers = response.data.map((user: any) => ({
          id: user._id || user.id || '',
          firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
          lastName: user.lastName || (user.name ? user.name.split(' ')[1] || '' : ''),
          email: user.email || '',
          role: user.role || 'user',
          status: user.status || 'pending',
          position: user.position || '',
          department: user.department || '',
          profileImage: user.profileImage || user.avatar || '',
          lastLogin: user.lastLogin || null,
          createdAt: user.createdAt || new Date().toISOString(),
        }));
      } else if (response.data.users && Array.isArray(response.data.users)) {
        // If response.data has a users array property
        mappedUsers = response.data.users.map((user: any) => ({
          id: user._id || user.id || '',
          firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
          lastName: user.lastName || (user.name ? user.name.split(' ')[1] || '' : ''),
          email: user.email || '',
          role: user.role || 'user',
          status: user.status || 'pending',
          position: user.position || '',
          department: user.department || '',
          profileImage: user.profileImage || user.avatar || '',
          lastLogin: user.lastLogin || null,
          createdAt: user.createdAt || new Date().toISOString(),
        }));
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // If response.data has a data array property
        mappedUsers = response.data.data.map((user: any) => ({
          id: user._id || user.id || '',
          firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
          lastName: user.lastName || (user.name ? user.name.split(' ')[1] || '' : ''),
          email: user.email || '',
          role: user.role || 'user',
          status: user.status || 'pending',
          position: user.position || '',
          department: user.department || '',
          profileImage: user.profileImage || user.avatar || '',
          lastLogin: user.lastLogin || null,
          createdAt: user.createdAt || new Date().toISOString(),
        }));
      }
      
      console.log('Mapped Users:', mappedUsers);
      setUsers(mappedUsers);
      
      // Show success toast if users were fetched
      if (mappedUsers.length > 0) {
        toast({
          title: "Users fetched successfully",
          description: `Loaded ${mappedUsers.length} users.`,
          variant: "default",
        });
      } else {
        toast({
          title: "No users found",
          description: "The system couldn't find any users.",
          variant: "destructive",
        });
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', errorMessage);
      
      toast({
        title: "Error fetching users",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logUsers = () => {
    console.log('Current Users:', users);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = getToken();
        if (token) {
          await fetchUsers();
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };
    
    initialize();
  }, []);

  return (
    <UserContext.Provider value={{ users, loading, error, fetchUsers, logUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
