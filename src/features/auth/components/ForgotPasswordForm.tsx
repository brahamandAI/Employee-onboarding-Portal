"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
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
import { forgotPasswordAction } from "@/features/auth/actions/auth.actions";
import { useToast } from "@/components/ui/toast";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await forgotPasswordAction(formData);

    if (result.success) {
      setSubmitted(true);
    } else if (!result.success) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  if (submitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Mail className="h-6 w-6 text-green-700" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            If an account exists with that email, we&apos;ve sent password reset
            instructions. The link expires in 1 hour.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link href="/staff/login">
            <Button variant="outline">Back to login</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@rakshaksecuritas.com"
              autoComplete="email"
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send Reset Link
          </Button>
          <Link
            href="/staff/login"
            className="flex items-center justify-center gap-1 text-sm text-[#64748B] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
