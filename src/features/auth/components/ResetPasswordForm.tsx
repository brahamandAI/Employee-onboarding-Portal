"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
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
import { resetPasswordAction } from "@/features/auth/actions/auth.actions";
import { useToast } from "@/components/ui/toast";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("token", token);

    const result = await resetPasswordAction(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push("/staff/login"), 3000);
    } else if (!result.success) {
      toast({
        title: "Reset failed",
        description: result.error,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-700" />
          </div>
          <CardTitle>Password updated</CardTitle>
          <CardDescription>
            Your password has been reset. Redirecting to login...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" required>
              New Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-[#64748B]">
              Min 8 characters, uppercase, lowercase, and number
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" required>
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset Password
          </Button>
          <Link
            href="/staff/login"
            className="text-sm text-[#64748B] hover:underline"
          >
            Back to login
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
