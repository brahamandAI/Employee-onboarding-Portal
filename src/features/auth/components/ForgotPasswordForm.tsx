"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordAction } from "@/features/auth/actions/auth.actions";
import { useToast } from "@/components/ui/toast";

const fieldClass =
  "h-12 rounded-xl border-[#D8E0EA] bg-[#F8FAFC] text-[0.9375rem] shadow-none hover:border-[#C5D0DE] focus-visible:border-sky-400 focus-visible:bg-white";

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
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100">
          <Mail className="h-5 w-5 text-emerald-700" />
        </div>
        <p className="text-sm leading-relaxed text-[#475569]">
          If an account exists with that email, we&apos;ve sent password reset
          instructions. The link expires in 1 hour.
        </p>
        <Link href="/staff/login" className="mt-6 inline-flex">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="-mt-2 mb-1 text-center text-sm text-[#64748B]">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <div className="space-y-2">
        <Label
          htmlFor="email"
          required
          className="text-[13px] font-semibold tracking-wide text-[#1E293B]"
        >
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
          className={fieldClass}
        />
      </div>
      <Button
        type="submit"
        className="mt-2 h-12 w-full shadow-lg shadow-[#0B1F3A]/20"
        isLoading={isLoading}
      >
        Send Reset Link
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
