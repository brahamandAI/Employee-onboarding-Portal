"use client";

import { useEffect, useState } from "react";
import type { OnboardingEmployee } from "@/features/onboarding/types";
import { OnboardingWizard } from "@/features/onboarding/components/OnboardingWizard";
import { ONBOARDING_TOTAL_STEPS } from "@/features/onboarding/constants";

interface OnboardingWizardLoaderProps {
  employee: OnboardingEmployee;
  registrationMode?: boolean;
  submitterMode?: boolean;
  l1EditMode?: boolean;
}

function WizardSkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col" aria-busy="true" aria-label="Loading form">
      <div className="sticky top-0 z-10 -mx-4 border-b border-[#E2E8F0] bg-white/95 px-4 py-3 sm:-mx-6 sm:px-6">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: ONBOARDING_TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 shrink-0 animate-pulse rounded-lg bg-[#E2E8F0]/80"
            />
          ))}
        </div>
        <div className="mt-2 h-3 w-48 animate-pulse rounded bg-[#E2E8F0]/70" />
      </div>
      <div className="mt-6 space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-[#E2E8F0]/80" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-[#E2E8F0]/70" />
              <div className="h-10 w-full animate-pulse rounded-md bg-[#F1F5F9]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OnboardingWizardLoader({
  employee,
  registrationMode,
  submitterMode,
  l1EditMode,
}: OnboardingWizardLoaderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  // Render after mount so browser extensions cannot inject attributes
  // (e.g. fdprocessedid) into SSR HTML and trigger hydration mismatches.
  if (!ready) {
    return <WizardSkeleton />;
  }

  return (
    <OnboardingWizard
      employee={employee}
      registrationMode={registrationMode}
      submitterMode={submitterMode}
      l1EditMode={l1EditMode}
    />
  );
}
