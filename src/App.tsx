
// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Analytics from "./pages/Analytics";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import UserManagement from "./pages/UserManagement";
import UserDetail from "./pages/UserDetail";
import Profile from "./pages/Profile";
import Payments from "./pages/Payments";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import PrivateRoute from "@/components/layout/PrivateRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Wrap protected routes with PrivateRoute */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
                <Route path="/messages" element={<Layout><Messages /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
                <Route path="/user-management" element={<Layout><UserManagement /></Layout>} />
                <Route path="/user-management/:id" element={<Layout><UserDetail /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/payments" element={<Layout><Payments /></Layout>} />
                <Route path="/properties" element={<Layout><Properties /></Layout>} />
                <Route path="/properties/:id" element={<Layout><PropertyDetail /></Layout>} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
