
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isCurrentUserManager, setIsCurrentUserManager] = useState(false);
  
  // Fetch all users and filter for managers
  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['managers'],
    queryFn: async () => {
      const response = await adminApi.getAllUsers();
      console.log('All users response:', response.data);
      return response.data;
    },
    onError: (error: any) => {
      console.error('Error fetching managers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load manager data. Please try again later.',
        variant: 'destructive',
      });
    },
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
      
      console.log('Filtered managers:', managersList);
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
      const response = await propertiesApi.getAllProperties();
      console.log('All properties response:', response.data);
      return response.data;
    },
    enabled: managers.length > 0,
    onError: (error: any) => {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to load properties data. Please try again later.',
        variant: 'destructive',
      });
    },
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
        console.error('Properties data is not an array:', propertyData);
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

      console.log('Mapped properties:', allProperties);
      setProperties(allProperties);

      // Filter properties if user is a manager
      if (isCurrentUserManager && user) {
        const userProperties = allProperties.filter(
          prop => prop.manager.id === user.id || prop.manager.email === user.email
        );
        console.log('Filtered properties for current manager:', userProperties);
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
