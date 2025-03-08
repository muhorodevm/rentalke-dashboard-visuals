import React, { createContext, useContext, useState } from 'react';

export type User = {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user' | 'manager';
  avatar?: string;
  department?: string;
  position?: string;
  phone?: string;
  profileImage?: string;
};

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  getToken: () => string | null;
  updateProfile: (userData: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    email: 'user@example.com',
    name: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    role: 'admin',
    department: 'Engineering',
    position: 'Senior Developer',
    phone: '+1 (555) 123-4567'
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login
      console.log('Logging in with', email, password);
      // In a real app, this would be an API call
      setUser({
        id: '1',
        email,
        name: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        role: 'admin',
        department: 'Engineering',
        position: 'Senior Developer',
        phone: '+1 (555) 123-4567'
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock registration
      console.log('Registering with', name, email, password);
      // In a real app, this would be an API call
      setUser({
        id: '1',
        email,
        name,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1],
        role: 'user'
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = () => {
    // Mock token retrieval
    return 'mock-token';
  };

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Mock profile update
      console.log('Updating profile with', userData);
      // In a real app, this would be an API call
      if (user) {
        setUser({
          ...user,
          ...userData
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        register, 
        isAuthenticated: !!user, 
        isLoading, 
        getToken,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
