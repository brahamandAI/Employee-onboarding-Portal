"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { changePasswordAction } from "@/features/auth/actions/auth.actions";

export function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await changePasswordAction(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setSuccess("Password updated successfully.");
      e.currentTarget.reset();
    });
  }

  return (
    <form id="change-password" onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
          <KeyRound className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-heading text-base font-semibold text-primary">
            Change password
          </h3>
          <p className="text-xs text-[#64748B]">
            Use at least 8 characters with upper, lower, and a number.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-[#334155]">Current password</span>
          <div className="relative">
            <input
              name="currentPassword"
              type={showCurrent ? "text" : "password"}
              required
              autoComplete="current-password"
              className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 pr-10 text-sm outline-none focus:border-sky-300"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#94A3B8] hover:text-primary"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-[#334155]">New password</span>
          <div className="relative">
            <input
              name="newPassword"
              type={showNew ? "text" : "password"}
              required
              autoComplete="new-password"
              className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 pr-10 text-sm outline-none focus:border-sky-300"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#94A3B8] hover:text-primary"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-[#334155]">Confirm new password</span>
          <input
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            className="h-10 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm outline-none focus:border-sky-300"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      )}

      <Button type="submit" variant="teal" isLoading={isPending}>
        Update password
      </Button>
    </form>
  );
}
