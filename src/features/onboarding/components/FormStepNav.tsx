"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ONBOARDING_STEPS,
  ONBOARDING_TOTAL_STEPS,
} from "@/features/onboarding/constants";

interface FormStepNavProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
  trailing?: ReactNode;
}

export function FormStepNav({
  currentStep,
  completedSteps,
  onStepClick,
  trailing,
}: FormStepNavProps) {
  return (
    <nav aria-label="Form sections">
      <div className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ONBOARDING_STEPS.map((step) => {
          const done = completedSteps.includes(step.id);
          const active = step.id === currentStep;
          const handleClick = () => {
            if (onStepClick) onStepClick(step.id);
          };

          return (
            <button
              key={step.id}
              type="button"
              onClick={handleClick}
              suppressHydrationWarning
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors",
                active && "bg-[#EFF6FF] text-[#1D4ED8] ring-1 ring-[#BFDBFE]",
                !active && done && "text-[#334155] hover:bg-[#F8FAFC]",
                !active && !done && "text-[#94A3B8] hover:bg-[#F8FAFC]"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  done && "bg-green-600 text-white",
                  active && !done && "bg-[#1D4ED8] text-white",
                  !active && !done && "bg-[#E2E8F0] text-[#64748B]"
                )}
              >
                {done ? <Check className="h-3 w-3" /> : step.id}
              </span>
              <span className="hidden font-medium sm:inline">{step.shortLabel}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[11px] font-medium text-[#64748B]">
          Section {currentStep} of {ONBOARDING_TOTAL_STEPS}:{" "}
          <span className="text-[#1E3A8A]">
            {ONBOARDING_STEPS[currentStep - 1]?.label}
          </span>
        </p>
        {trailing}
      </div>
    </nav>
  );
}
