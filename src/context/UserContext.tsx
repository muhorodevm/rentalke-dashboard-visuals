
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/services/api';

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

interface UserCache {
  data: User[];
  timestamp: number;
}

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: (forceRefresh?: boolean) => Promise<void>;
  logUsers: () => void;
  clearCache: () => void;
}

// Cache expiration time (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { toast } = useToast();

  // Clear the users cache
  const clearCache = useCallback(() => {
    localStorage.removeItem('usersCache');
    toast({
      title: "Cache cleared",
      description: "User cache has been cleared.",
    });
  }, [toast]);

  // Function to get cached users
  const getCachedUsers = useCallback((): UserCache | null => {
    const cachedData = localStorage.getItem('usersCache');
    if (!cachedData) return null;
    
    try {
      const parsedCache = JSON.parse(cachedData) as UserCache;
      const now = new Date().getTime();
      
      // Check if cache is expired
      if (now - parsedCache.timestamp > CACHE_EXPIRATION) {
        localStorage.removeItem('usersCache');
        return null;
      }
      
      return parsedCache;
    } catch (error) {
      localStorage.removeItem('usersCache');
      return null;
    }
  }, []);
  
  // Save users to cache
  const saveUsersToCache = useCallback((userData: User[]) => {
    const cacheData: UserCache = {
      data: userData,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem('usersCache', JSON.stringify(cacheData));
  }, []);

  const fetchUsers = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      
      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedUsers = getCachedUsers();
        if (cachedUsers) {
          setUsers(cachedUsers.data);
          setLoading(false);
          console.log('Using cached user data');
          return;
        }
      }
      
      // No valid cache or forcing refresh, fetch from API
      setLoading(true);
      
      const token = getToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const response = await adminApi.getAllUsers();
      console.log('Fetched Users API Response:', response.data);
      
      let mappedUsers: User[] = [];
      
      if (response.data && Array.isArray(response.data)) {
        // If response.data is already an array
        mappedUsers = mapApiResponseToUsers(response.data);
      } else if (response.data && response.data.users && Array.isArray(response.data.users)) {
        // If response.data has a users array property
        mappedUsers = mapApiResponseToUsers(response.data.users);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // If response.data has a data array property
        mappedUsers = mapApiResponseToUsers(response.data.data);
      }
      
      console.log('Mapped Users:', mappedUsers);
      
      // Save to state and cache
      setUsers(mappedUsers);
      saveUsersToCache(mappedUsers);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', errorMessage);
      
      // Only show error toast if no cached data available
      if (!getCachedUsers()?.data.length) {
        toast({
          title: "Error fetching users",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [getToken, toast, getCachedUsers, saveUsersToCache]);

  const mapApiResponseToUsers = (data: any[]): User[] => {
    return data.map((user: any) => ({
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
  };

  const logUsers = () => {
    console.log('Current Users:', users);
  };

  // Initial fetch on mount
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
  }, [getToken, fetchUsers]);

  return (
    <UserContext.Provider value={{ users, loading, error, fetchUsers, logUsers, clearCache }}>
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
