"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  employeeRequestOtpAction,
  employeeVerifyOtpAction,
} from "@/features/auth/actions/auth.actions";
import { useToast } from "@/components/ui/toast";

type Step = "credentials" | "otp";

export function EmployeeLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("credentials");
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    applicationRef: "",
    email: "",
    maskedEmail: "",
  });
  const [resendCooldown, setResendCooldown] = useState(0);

  async function handleCredentialsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await employeeRequestOtpAction(formData);

    if (result.success && result.data) {
      setCredentials({
        applicationRef: result.data.applicationRef,
        email: result.data.email,
        maskedEmail: result.data.maskedEmail,
      });
      setStep("otp");
      setResendCooldown(45);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      toast({
        title: "OTP sent",
        description: `Check your email at ${result.data.maskedEmail}`,
        variant: "success",
      });
    } else if (!result.success) {
      toast({
        title: "Access denied",
        description: result.error ?? "Invalid credentials",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("applicationRef", credentials.applicationRef);
    formData.set("email", credentials.email);

    const result = await employeeVerifyOtpAction(formData);

    if (result.success && result.data?.redirectTo) {
      router.push(result.data.redirectTo);
      router.refresh();
    } else if (!result.success) {
      toast({
        title: "Verification failed",
        description: result.error ?? "Invalid OTP",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  async function handleResendOtp() {
    if (resendCooldown > 0) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.set("applicationRef", credentials.applicationRef);
    formData.set("email", credentials.email);

    const result = await employeeRequestOtpAction(formData);

    if (result.success) {
      setResendCooldown(45);
      toast({
        title: "OTP resent",
        description: `New code sent to ${credentials.maskedEmail}`,
        variant: "success",
      });
    } else if (!result.success) {
      toast({
        title: "Failed to resend",
        description: result.error,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  if (step === "otp") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {credentials.maskedEmail}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleOtpSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" required>
                One-Time Password
              </Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="000000"
                className="text-center text-lg tracking-widest"
                required
                disabled={isLoading}
                autoComplete="one-time-code"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Verify & Continue
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-sm"
              disabled={resendCooldown > 0 || isLoading}
              onClick={handleResendOtp}
            >
              {resendCooldown > 0
                ? `Resend code in 0:${resendCooldown.toString().padStart(2, "0")}`
                : "Resend code"}
            </Button>
            <button
              type="button"
              onClick={() => setStep("credentials")}
              className="text-sm text-[#64748B] hover:underline"
            >
              ← Back
            </button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Access Your Application</CardTitle>
        <CardDescription>
          Enter your application reference and registered email
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleCredentialsSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="applicationRef" required>
              Application Reference
            </Label>
            <Input
              id="applicationRef"
              name="applicationRef"
              type="text"
              placeholder="RS-APP-20260704-A1B2"
              className="font-mono uppercase"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" required>
              Registered Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Continue
          </Button>
          <p className="text-center text-xs text-[#64748B]">
            New applicant?{" "}
            <Link href="/apply" className="text-[#1D4ED8] hover:underline">
              Start registration
            </Link>
          </p>
          <p className="flex items-center justify-center gap-1 text-xs text-[#64748B]">
            <Lock className="h-3 w-3" />
            Your data is encrypted and secure
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
