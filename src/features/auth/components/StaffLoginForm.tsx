"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { staffLoginAction } from "@/features/auth/actions/auth.actions";
import { StaffSignInFormFields } from "@/features/auth/components/StaffSignInFormFields";
import { useToast } from "@/components/ui/toast";
import { UserRole } from "@/types/enums";

export function StaffLoginForm() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") ?? "";
  const portalRole = searchParams.get("role") ?? UserRole.SUBMITTER;
  const [role, setRole] = useState(portalRole);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    if (callbackUrl) {
      formData.set("callbackUrl", callbackUrl);
    }

    const result = await staffLoginAction(formData);

    if (result.success && result.data?.redirectTo) {
      window.location.assign(result.data.redirectTo);
      return;
    } else if (!result.success) {
      toast({
        title: "Login failed",
        description: result.error ?? "Invalid credentials",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      <StaffSignInFormFields
        idPrefix="page-"
        role={role}
        onRoleChange={setRole}
        isLoading={isLoading}
      />

      <Button
        type="submit"
        className="mt-6 h-11 w-full rounded-xl bg-[#1D4ED8] text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-[#1E40AF]"
        isLoading={isLoading}
      >
        Sign In
      </Button>
    </form>
  );
}
