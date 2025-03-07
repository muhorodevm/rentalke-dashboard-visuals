
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { initializeSocket, closeSocket } from "@/utils/socket";

// Define types for user and context state
interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  phone: string | null;
  department?: string | null;
  position?: string | null;
  profileImage?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUserProfile: (profileData: Partial<User>) => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://rentalke-server-2.onrender.com/api/v1";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to check if token is expired
  const isTokenValid = (): boolean => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    
    try {
      // Parse the JWT token to get the expiration time
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const { exp } = JSON.parse(jsonPayload);
      
      // Check if token is expired
      return Date.now() < exp * 1000;
    } catch (error) {
      console.error("Error parsing token:", error);
      return false;
    }
  };

  // Get token function for components that need it
  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  // Load user session on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      if (isTokenValid()) {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);

          // Reattach Authorization header on reload
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          
          // Initialize socket connection
          initializeSocket(token);
        }
      } else {
        // If token is expired or invalid, logout silently
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
        delete axios.defaults.headers.common["Authorization"];
        closeSocket();
      }
      
      setIsLoading(false);
    };

    initAuth();
    
    // Clean up socket on unmount
    return () => {
      closeSocket();
    };
  }, []);

  // Login function - returns a boolean success indicator
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login to:", `${API_BASE_URL}/admin/login`);
      const response = await axios.post(`${API_BASE_URL}/admin/login`, { email, password });

      const { token, user, message } = response.data;
      console.log("Login response:", { token: token ? "Received" : "None", user });
      
      // Store token and user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setIsAuthenticated(true);
      setUser(user);

      // Set the Authorization header for Axios globally
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Initialize socket connection
      initializeSocket(token);

      // Redirect to dashboard
      navigate("/");
      toast({ description: message || "Login Successful", variant: "default" });
      
      return true;
    } catch (error: any) {
      console.error("Login failed", error.response || error);
      const errorMessage = error.response?.data?.message || "Login failed. Check your credentials.";
      toast({ description: errorMessage, variant: "destructive" });
      return false;
    }
  };

  // Update user profile
  const updateUserProfile = (profileData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // Logout function
  const logout = () => {
    // Close socket connection
    closeSocket();
    
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear state
    setIsAuthenticated(false);
    setUser(null);

    // Remove auth header from axios
    delete axios.defaults.headers.common["Authorization"];

    // Redirect to login
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      isLoading, 
      updateUserProfile,
      getToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
