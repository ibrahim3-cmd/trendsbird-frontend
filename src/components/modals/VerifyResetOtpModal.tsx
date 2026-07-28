/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Mail, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// RTK Query
import { useVerifyResetOtpMutation } from "@/redux/features/auth/auth.api";

interface VerifyResetOtpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onSuccess: () => void;
  onResend: () => void;
}

export function VerifyResetOtpModal({
  open,
  onOpenChange,
  email,
  onSuccess,
  onResend,
}: VerifyResetOtpModalProps) {
  const [otp, setOtp] = React.useState("");
  const [verifyResetOtp, { isLoading }] = useVerifyResetOtpMutation();
  const [resendCooldown, setResendCooldown] = React.useState(0);

  // Countdown for resend button
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Start cooldown when modal opens
  React.useEffect(() => {
    if (open) {
      setResendCooldown(60); // 60 seconds cooldown
      setOtp(""); // Reset OTP
    }
  }, [open]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      await verifyResetOtp({ email, otp }).unwrap();
      toast.success("OTP verified! Password reset link has been sent to your email.");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Invalid OTP. Please try again.";
      toast.error(errorMessage);
      setOtp(""); // Clear OTP on error
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    
    onResend();
    setResendCooldown(60);
    setOtp("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-system-secondary/20 rounded-full blur-lg animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-system-secondary/10 to-system-secondary/20 p-4 rounded-2xl border border-system-secondary/30">
                <ShieldCheck className="h-8 w-8 text-system-secondary" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <DialogTitle className="text-center text-xl">Verify Your Identity</DialogTitle>
          <DialogDescription className="text-center">
            We've sent a 6-digit verification code to
            <div className="flex items-center justify-center gap-1.5 mt-2 text-foreground font-medium">
              <Mail className="h-3.5 w-3.5 text-system-secondary" />
              {email}
            </div>
            <span className="block mt-2 text-xs text-muted-foreground">
              The code expires in 5 minutes
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* OTP Input */}
          <div className="flex flex-col items-center gap-3">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            
            <p className="text-xs text-muted-foreground">
              Enter the code from your email
            </p>
          </div>

          {/* Info Alert */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 dark:text-blue-300">
              After verification, we'll send a password reset link to your email
            </p>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-system-secondary text-system-secondary-text hover:bg-system-secondary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Send Reset Link"
            )}
          </Button>

          {/* Resend Link */}
          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-sm text-system-secondary hover:text-system-secondary/80 disabled:text-muted-foreground disabled:cursor-not-allowed underline underline-offset-4"
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Didn't receive code? Resend"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
