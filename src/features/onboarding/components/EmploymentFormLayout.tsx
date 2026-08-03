"use client";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { StaffSignInButton } from "@/features/auth/components/StaffSignInButton";
import {
  ONBOARDING_STEPS,
  ONBOARDING_TOTAL_STEPS,
} from "@/features/onboarding/constants";

interface EmploymentFormLayoutProps {
  children: React.ReactNode;
  currentStep?: number;
  applicationRef?: string;
}

export function EmploymentFormLayout({
  children,
  currentStep,
  applicationRef,
}: EmploymentFormLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-[#E2E8F0] bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <BrandLogo href="/" variant="dark" />
          <div className="flex items-center gap-3">
            {applicationRef && (
              <p className="font-mono text-xs font-semibold text-[#1D4ED8] sm:text-sm">
                {applicationRef}
              </p>
            )}
            <StaffSignInButton />
          </div>
        </div>
        {currentStep && (
          <div className="mx-auto mt-3 max-w-5xl">
            <div className="h-1 overflow-hidden rounded-full bg-[#E2E8F0]">
              <div
                className="h-full rounded-full bg-[#1D4ED8] transition-all duration-500"
                style={{ width: `${(currentStep / ONBOARDING_TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-[#64748B]">
              {ONBOARDING_STEPS[currentStep - 1]?.label}
            </p>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
