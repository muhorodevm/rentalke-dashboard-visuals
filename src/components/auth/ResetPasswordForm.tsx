import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface ResetPasswordFormProps {
  email: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleBackToLogin: () => void;
}

const API_BASE_URL = "https://rentalke-server-2.onrender.com/api/v1/admin";

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  email,
  isLoading,
  setIsLoading,
  handleBackToLogin
}) => {
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const { toast } = useToast();

  const validateForm = () => {
    if (!otp.trim()) {
      toast({
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return false;
    }

    if (otp.length < 6) {
      toast({
        description: "Please enter a valid verification code",
        variant: "destructive",
      });
      return false;
    }

    if (!newPassword.trim()) {
      toast({
        description: "Please enter a new password",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword.length < 6) {
      toast({
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast({
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        otp,
        newPassword
      });
      
      const { message, success } = response.data;
      
      if (success) {
        toast({
          description: message || "Password reset successful",
          variant: "default",
        });
        
        // Redirect to login page after successful password reset
        setTimeout(() => {
          handleBackToLogin();
        }, 1500);
      } else {
        toast({
          description: message || "Failed to reset password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Failed to reset password:", error);
      const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again.";
      toast({
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter verification code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            className="pl-10"
            required
            disabled={isLoading}
            maxLength={6}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Eye className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Eye className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Resetting Password..." : "Reset Password"}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
