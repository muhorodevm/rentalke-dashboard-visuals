import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

// Define types for user and context state
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to check if token is expired
  const isTokenValid = (): boolean => {
    const token = localStorage.getItem("token");
    const expirationTime = localStorage.getItem("token_expiration");
    
    if (!token || !expirationTime) return false;

    return Date.now() < Number(expirationTime); // If current time is before expiration, token is valid
  };

  // Load user session on page reload
  useEffect(() => {
    if (isTokenValid()) {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);

        // Reattach Authorization header on reload
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    } else {
      logout(); // If token is expired, logout
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });

      const { token, user, expiresIn } = response.data; // Ensure backend returns `expiresIn` (in seconds)
      const expirationTime = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds

      // Store token and user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token_expiration", expirationTime.toString());

      setIsAuthenticated(true);
      setUser(user);

      // Set the Authorization header for Axios globally
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect to dashboard
      navigate("/");
      toast({ description: "Login Successful", variant: "default" });
    } catch (error) {
      console.error("Login failed", error);
      toast({ description: "Login failed. Check your credentials.", variant: "destructive" });
    }
  };

  // Logout function
  const logout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token_expiration");

    // Clear state
    setIsAuthenticated(false);
    setUser(null);

    // Remove auth header from axios
    delete axios.defaults.headers.common["Authorization"];

    // Redirect to login
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
