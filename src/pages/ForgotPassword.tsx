import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, KeyRound, ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

const API_BASE_URL = "https://rentalke-server-2.onrender.com/api/v1/admin";

type Step = "email" | "otp" | "reset";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <img src="/placeholder.svg" alt="RentalKE Logo" className="h-12 w-auto" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {step === "email" && "Forgot Password"}
              {step === "otp" && "Verify OTP"}
              {step === "reset" && "Reset Password"}
            </CardTitle>
            <CardDescription>
              {step === "email" && "Enter your email to receive a verification code"}
              {step === "otp" && "Enter the verification code sent to your email"}
              {step === "reset" && "Create a new password for your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "email" && (
              <ForgotPasswordForm 
                email={email}
                setEmail={setEmail}
                setStep={setStep}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setOtpSent={setOtpSent}
              />
            )}
            
            {step === "otp" && (
              <OtpVerificationForm 
                email={email}
                setStep={setStep}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                otpSent={otpSent}
                setOtpVerified={setOtpVerified}
              />
            )}
            
            {step === "reset" && (
              <ResetPasswordForm 
                email={email}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                handleBackToLogin={handleBackToLogin}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              variant="ghost" 
              onClick={handleBackToLogin}
              className="w-full flex items-center gap-2"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} RentalKE. All rights reserved.</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
