
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi, propertiesApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Manager {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'pending';
  units: number;
  rent: number;
  manager: Manager;
  createdAt: string;
  imageUrl?: string;
}

export const useManagerProperties = () => {
  const { user, getToken } = useAuth();
  const { toast } = useToast();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isCurrentUserManager, setIsCurrentUserManager] = useState(false);
  
  // Check if user is authenticated before making requests
  const token = getToken();
  const isAuthenticated = !!token && !!user;
  
  // Fetch all users and filter for managers
  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['managers'],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error('Authentication required');
      }
      const response = await adminApi.getAllUsers();
      return response.data;
    },
    enabled: isAuthenticated,
    meta: {
      onError: (error: any) => {
        // Only show error toast for non-auth errors
        if (!error.message.includes('Authentication required')) {
          toast({
            title: 'Error',
            description: 'Failed to load manager data. Please try again later.',
            variant: 'destructive',
          });
        }
      }
    }
  });

  // Process users data to extract managers
  useEffect(() => {
    if (usersData) {
      // Handle different response structures
      let userData = usersData;
      
      if (usersData.users) {
        userData = usersData.users;
      } else if (usersData.data) {
        userData = usersData.data;
      }
      
      // Filter users with MANAGER role
      const managersList = Array.isArray(userData) 
        ? userData.filter((user: any) => user.role === 'MANAGER').map((user: any) => ({
            id: user._id || user.id,
            name: user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.name || 'Unknown Manager',
            email: user.email,
            role: user.role,
            profileImage: user.profileImage || user.avatar
          }))
        : [];
      
      setManagers(managersList);
      
      // Check if current user is a manager
      const isManager = user && user.role === 'MANAGER';
      setIsCurrentUserManager(isManager);
    }
  }, [usersData, user]);

  // Fetch properties based on managers
  const { data: propertiesData, isLoading: isLoadingProperties, error: propertiesError } = useQuery({
    queryKey: ['properties', managers],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error('Authentication required');
      }
      const response = await propertiesApi.getAllProperties();
      return response.data;
    },
    enabled: isAuthenticated && managers.length > 0,
    meta: {
      onError: (error: any) => {
        // Only show error toast for non-auth errors
        if (!error.message.includes('Authentication required')) {
          toast({
            title: 'Error',
            description: 'Failed to load properties data. Please try again later.',
            variant: 'destructive',
          });
        }
      }
    }
  });

  // Process properties data and filter by manager
  useEffect(() => {
    if (propertiesData && managers.length > 0) {
      let propertyData = propertiesData;
      
      if (propertiesData.properties) {
        propertyData = propertiesData.properties;
      } else if (propertiesData.data) {
        propertyData = propertiesData.data;
      }
      
      if (!Array.isArray(propertyData)) {
        return;
      }

      const allProperties = propertyData.map((prop: any) => {
        const managerId = prop.manager?._id || prop.manager?.id || prop.managerId;
        const manager = managers.find(m => m.id === managerId) || {
          id: managerId || 'unknown',
          name: 'Unknown Manager',
          email: '',
          role: 'MANAGER'
        };
        
        return {
          id: prop._id || prop.id,
          name: prop.name || prop.title || 'Unnamed Property',
          address: prop.address || 'No address provided',
          city: prop.city || 'Unknown',
          type: prop.type || 'Residential',
          status: prop.status || 'available',
          units: prop.units || 0,
          rent: prop.rent || 0,
          manager,
          createdAt: prop.createdAt || new Date().toISOString(),
          imageUrl: prop.imageUrl || prop.image
        };
      });

      setProperties(allProperties);

      // Filter properties if user is a manager
      if (isCurrentUserManager && user) {
        const userProperties = allProperties.filter(
          prop => prop.manager.id === user.id || prop.manager.email === user.email
        );
        setFilteredProperties(userProperties);
      } else {
        setFilteredProperties(allProperties);
      }
    }
  }, [propertiesData, managers, isCurrentUserManager, user]);

  return {
    managers,
    properties: isCurrentUserManager ? filteredProperties : properties,
    isLoading: isLoadingUsers || isLoadingProperties,
    error: usersError || propertiesError,
    isCurrentUserManager
  };
};

export default useManagerProperties;
