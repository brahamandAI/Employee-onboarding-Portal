"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STAFF_ROLE_OPTIONS } from "@/features/auth/constants";
import { UserRole } from "@/types/enums";
import { cn } from "@/lib/utils";

interface StaffSignInFormFieldsProps {
  idPrefix?: string;
  role: string;
  onRoleChange: (role: string) => void;
  isLoading?: boolean;
  showForgotPassword?: boolean;
  className?: string;
  emailInputRef?: React.RefObject<HTMLInputElement | null>;
}

function emailPlaceholder(role: string): string {
  if (role === UserRole.L1) return "l1@rakshaksecuritas.com";
  if (role === UserRole.L2) return "l2@rakshaksecuritas.com";
  if (role === UserRole.SUPPORT) return "support@rakshaksecuritas.com";
  if (role === UserRole.ADMIN) return "admin@rakshaksecuritas.com";
  return "you@rakshaksecuritas.com";
}

export function StaffSignInFormFields({
  idPrefix = "",
  role,
  onRoleChange,
  isLoading = false,
  showForgotPassword = true,
  className,
  emailInputRef,
}: StaffSignInFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const roleId = `${idPrefix}staff-role`;
  const emailId = `${idPrefix}staff-email`;
  const passwordId = `${idPrefix}staff-password`;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor={roleId} required>
          Role
        </Label>
        <select
          id={roleId}
          name="role"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          required
          disabled={isLoading}
          className="flex h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>
            Select your role
          </option>
          {STAFF_ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={emailId} required>
          Email
        </Label>
        <Input
          id={emailId}
          ref={emailInputRef}
          name="email"
          type="email"
          placeholder={emailPlaceholder(role)}
          autoComplete="username"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={passwordId} required>
            Password
          </Label>
          {showForgotPassword && (
            <Link
              href="/staff/forgot-password"
              className="text-xs text-[#1D4ED8] hover:underline"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <div className="relative">
          <Input
            id={passwordId}
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            disabled={isLoading}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#64748B] hover:text-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
