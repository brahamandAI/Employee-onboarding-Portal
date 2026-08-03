"use client";

import { useEffect, useState } from "react";
import { OnboardingWizardLoader } from "@/features/onboarding/components/OnboardingWizardLoader";
import { openL1EmployeeEditSession } from "@/features/l1/actions/l1-edit.actions";
import type { OnboardingEmployee } from "@/features/onboarding/types";

export function L1EditWorkspace({
  employeeId,
  employee,
}: {
  employeeId: string;
  employee: OnboardingEmployee;
}) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await openL1EmployeeEditSession(employeeId);
      if (cancelled) return;
      if (!result.success) {
        setError(result.error);
        return;
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [employeeId]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error}
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[#64748B]">
        Preparing edit form…
      </div>
    );
  }

  return (
    <OnboardingWizardLoader
      employee={employee}
      registrationMode={false}
      l1EditMode
    />
  );
}
