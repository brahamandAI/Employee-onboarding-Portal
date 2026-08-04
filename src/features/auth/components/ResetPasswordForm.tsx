"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction } from "@/features/auth/actions/auth.actions";
import { useToast } from "@/components/ui/toast";

interface ResetPasswordFormProps {
  token: string;
}

const fieldClass =
  "h-12 rounded-xl border-[#D8E0EA] bg-[#F8FAFC] text-[0.9375rem] shadow-none hover:border-[#C5D0DE] focus-visible:border-sky-400 focus-visible:bg-white";

const labelClass = "text-[13px] font-semibold tracking-wide text-[#1E293B]";

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
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
          <CheckCircle2 className="h-5 w-5 text-emerald-700" />
        </div>
        <p className="text-sm font-semibold text-[#0B1F3A]">Password updated</p>
        <p className="mt-2 text-sm text-[#64748B]">
          Your password has been reset. Redirecting to login…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="-mt-2 mb-1 text-center text-sm text-[#64748B]">
        Enter your new password below.
      </p>
      <div className="space-y-2">
        <Label htmlFor="password" required className={labelClass}>
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
          className={fieldClass}
        />
        <p className="text-xs leading-relaxed text-[#64748B]">
          Min 8 characters, with uppercase, lowercase, and a number.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" required className={labelClass}>
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
          className={fieldClass}
        />
      </div>
      <Button
        type="submit"
        className="mt-2 h-12 w-full shadow-lg shadow-[#0B1F3A]/20"
        isLoading={isLoading}
      >
        Reset Password
      </Button>
      <Link
        href="/staff/login"
        className="flex items-center justify-center gap-1.5 pt-1 text-sm font-medium text-[#64748B] transition hover:text-[#0B1F3A]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to login
      </Link>
    </form>
  );
}
