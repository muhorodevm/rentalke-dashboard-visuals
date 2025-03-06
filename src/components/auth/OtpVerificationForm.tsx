import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, KeyRound, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface OtpVerificationFormProps {
  email: string;
  setStep: React.Dispatch<React.SetStateAction<"email" | "otp" | "reset">>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  otpSent: boolean;
  setOtpVerified: React.Dispatch<React.SetStateAction<boolean>>;
}

const API_BASE_URL = "https://rentalke-server-2.onrender.com/api/v1/manager";

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  email,
  setStep,
  isLoading,
  setIsLoading,
  otpSent,
  setOtpVerified
}) => {
  const [otp, setOtp] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 minutes in seconds
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (otpSent) {
      startTimer();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [otpSent]);

  const startTimer = () => {
    setTimeLeft(180);
    setCanResend(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setCanResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast({
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    if (otp.length < 6) {
      toast({
        description: "Please enter a valid verification code",
        variant: "destructive",
      });
      return;
    }

    setOtpVerified(true);
    setStep("reset");
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setResending(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      
      const { message, success } = response.data;
      
      if (success) {
        toast({
          description: message || "OTP resent to your email",
          variant: "default",
        });
        startTimer();
      } else {
        toast({
          description: message || "Failed to resend OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Failed to resend OTP:", error);
      const errorMessage = error.response?.data?.message || "Failed to resend OTP. Please try again.";
      toast({
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            className="pl-10"
            required
            disabled={isLoading}
            maxLength={6}
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || otp.length < 6}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </span>
          ) : (
            "Verify Code"
          )}
        </Button>
        
        <div className="text-center text-sm">
          {!canResend ? (
            <p className="text-muted-foreground">
              Resend code in: <span className="font-medium">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendOtp}
              disabled={resending || !canResend}
              className="h-auto p-0 text-primary hover:text-primary-focus"
            >
              <span className="flex items-center">
                {resending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Resend Code
              </span>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default OtpVerificationForm;
