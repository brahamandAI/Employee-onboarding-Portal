"use client";

import type { OnboardingEmployee } from "@/features/onboarding/types";
import { OnboardingWizard } from "@/features/onboarding/components/OnboardingWizard";

interface OnboardingWizardLoaderProps {
  employee: OnboardingEmployee;
  registrationMode?: boolean;
  submitterMode?: boolean;
  l1EditMode?: boolean;
}

export function OnboardingWizardLoader({
  employee,
  registrationMode,
  submitterMode,
  l1EditMode,
}: OnboardingWizardLoaderProps) {
  return (
    <OnboardingWizard
      employee={employee}
      registrationMode={registrationMode}
      submitterMode={submitterMode}
      l1EditMode={l1EditMode}
    />
  );
}
