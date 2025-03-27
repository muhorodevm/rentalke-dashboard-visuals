
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export type User = {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role?:string;
  department?: string;
  position?: string;
  phone?: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  lastLogin?: Date;
  
};

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

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

const API_URL = 'https://rentalke-server-kmrj.onrender.com/api/v1/admin/login';

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert seconds to milliseconds
    return Date.now() > expiry;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If we can't verify, assume it's expired
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if we have a stored token and it's valid
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Check if the token is expired
        if (isTokenExpired(token)) {
          // Token is expired, clear it
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          // Token is valid, restore user from localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (error) {
              console.error('Error parsing stored user:', error);
              localStorage.removeItem('user');
            }
          }
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post<AuthResponse>(API_URL, { email, password });
      
      
  
      if (response.data.success && response.data.token) {
        const { token, user: userData } = response.data;
        
        // Store token and user data in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update application state
        setUser(userData);
        
        // Set Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Clear Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Update application state
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // For now, registration is mocked as the API endpoint wasn't provided
      console.log('Registering with', name, email, password);
      // In a real app, this would be an API call
      setUser({
        id: '1',
        email,
        name,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1],
        role: 'user',

      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Mock profile update
      console.log('Updating profile with', userData);
      // In a real app, this would be an API call
      if (user) {
        const updatedUser = {
          ...user,
          ...userData
        };
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update application state
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Set up axios interceptor to handle token in requests
  useEffect(() => {
    const token = getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Set up an interceptor for handling expired tokens
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expired or invalid, log out the user
          logout();
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      // Clean up interceptor when the component unmounts
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

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
