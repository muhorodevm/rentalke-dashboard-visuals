import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

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

      console.log('Fetched Users:', response.data); // Logging users without mapping
      
      setUsers(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', errorMessage);
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
  }, [getToken]);

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
