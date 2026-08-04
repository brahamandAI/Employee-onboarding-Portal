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
  const [formError, setFormError] = useState<string | null>(null);
  const callbackUrl = searchParams.get("callbackUrl") ?? "";
  const portalRole = searchParams.get("role") ?? UserRole.SUBMITTER;
  const [role, setRole] = useState(portalRole);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    if (callbackUrl) {
      formData.set("callbackUrl", callbackUrl);
    }

    const result = await staffLoginAction(formData);

    if (result.success && result.data?.redirectTo) {
      window.location.assign(result.data.redirectTo);
      return;
    }

    const message = result.success
      ? "Unable to sign in"
      : (result.error ?? "Invalid credentials");
    setFormError(message);
    toast({
      title: "Login failed",
      description: message,
      variant: "destructive",
    });
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0" noValidate>
      <StaffSignInFormFields
        idPrefix="page-"
        role={role}
        onRoleChange={setRole}
        isLoading={isLoading}
      />

      {formError && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700"
        >
          {formError}
        </div>
      )}

      <Button
        type="submit"
        variant="default"
        className="mt-7 h-12 w-full text-[0.95rem] shadow-lg shadow-[#0B1F3A]/20 hover:shadow-xl hover:shadow-[#0B1F3A]/25"
        isLoading={isLoading}
      >
        {isLoading ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
