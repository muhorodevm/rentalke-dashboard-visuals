import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface ForgotPasswordFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<"email" | "otp" | "reset">>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOtpSent: React.Dispatch<React.SetStateAction<boolean>>;
}

const API_BASE_URL = "https://rentalke-server-2.onrender.com/api/v1/admin";

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  email,
  setEmail,
  setStep,
  isLoading,
  setIsLoading,
  setOtpSent
}) => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      
      const { message, success } = response.data;
      
      if (success) {
        toast({
          description: message || "OTP sent to your email",
          variant: "default",
        });
        setOtpSent(true);
        setStep("otp");
      } else {
        toast({
          description: message || "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Failed to send OTP:", error);
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
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
          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Reset Code"}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
