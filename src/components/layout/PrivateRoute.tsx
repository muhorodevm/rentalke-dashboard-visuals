import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // Avoid redirecting before auth state is fully determined
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loading indicator temporarily
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
