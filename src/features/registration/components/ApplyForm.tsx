"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
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
import { registerEmployeeAction } from "@/features/registration/actions/register.actions";
import { useToast } from "@/components/ui/toast";

export function ApplyForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerEmployeeAction(formData);

    if (result.success) {
      toast({
        title: "Application created",
        description: `Reference: ${result.applicationRef}`,
        variant: "success",
      });
      router.push(`/onboarding/${result.applicationRef}`);
      router.refresh();
    } else if (!result.success) {
      toast({
        title: "Registration failed",
        description: result.error,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>New Applicant Registration</CardTitle>
        <CardDescription>
          Create your account to begin the employment onboarding process
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" required>
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Rajesh Kumar"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@email.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" required>
              Mobile Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="9876543210"
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create Application
          </Button>
          <p className="text-center text-xs text-[#64748B]">
            Already registered?{" "}
            <Link href="/login" className="text-[#1D4ED8] hover:underline">
              Access your application
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
