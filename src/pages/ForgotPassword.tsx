/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ShieldCheck, Mail, Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { VerifyResetOtpModal } from "@/components/modals/VerifyResetOtpModal";

// RTK Query
import { useForgotPasswordMutation } from "@/redux/features/auth/auth.api";

export default function ForgotPasswordPage({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const form = useForm({
    defaultValues: { email: "" },
  });

  const [showOtpModal, setShowOtpModal] = React.useState(false);
  const [currentEmail, setCurrentEmail] = React.useState("");
  const [resetLinkSent, setResetLinkSent] = React.useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setCurrentEmail(data.email);
      setShowOtpModal(true);
      toast.success("Verification code sent! Please check your email.");
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to send verification code. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleOtpSuccess = () => {
    setResetLinkSent(true);
  };

  const handleResendOtp = async () => {
    try {
      await forgotPassword({ email: currentEmail }).unwrap();
      toast.success("Verification code resent! Please check your email.");
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to resend verification code.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className={cn("min-h-[100svh] grid place-items-center px-4", className)} {...props}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          {/* Brand */}
          <div className="flex items-center justify-center">
            {/* replace src with your actual logo file/path */}
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-8"
              onError={(e) => {
                // fallback to text if logo missing
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-system-secondary/20 px-3 py-1 text-xs font-medium text-system-secondary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Bank‑grade security
            </div>
          </div>

          <div className="text-center">
            <CardTitle>Forgot your password?</CardTitle>
            <CardDescription>
              Enter your email and we'll send a verification code to confirm your identity.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {resetLinkSent ? (
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-lg">
                <p className="text-green-800 dark:text-green-300 font-medium mb-2">
                  ✓ Verification successful!
                </p>
                <p className="text-green-700 dark:text-green-400">
                  A password reset link has been sent to your email. Please check your inbox
                  (and spam folder). The link expires in <strong>10 minutes</strong>.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Link to="/login" className="inline-flex items-center text-xs underline underline-offset-4">
                  <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email address" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                          </span>
                          <Input
                            placeholder="you@example.com"
                            {...field}
                            value={field.value || ""}
                            className="pl-9 focus-visible:border-system-primary focus-visible:ring-2 focus-visible:ring-system-primary"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-system-secondary text-system-secondary-text hover:bg-system-secondary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending verification code…
                    </>
                  ) : (
                    "Send verification code"
                  )}
                </Button>

                <div className="text-center text-xs">
                  <Link to="/login" className="underline underline-offset-4 text-system-primary hover:text-system-primary/80">
                    Back to login
                  </Link>
                </div>
              </form>
            </Form>
          )}

          {/* OTP Verification Modal */}
          <VerifyResetOtpModal
            open={showOtpModal}
            onOpenChange={setShowOtpModal}
            email={currentEmail}
            onSuccess={handleOtpSuccess}
            onResend={handleResendOtp}
          />
        </CardContent>
      </Card>
    </div>
  );
}
