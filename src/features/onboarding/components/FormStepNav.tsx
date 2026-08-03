"use client";

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
}

export function FormStepNav({
  currentStep,
  completedSteps,
  onStepClick,
}: FormStepNavProps) {
  return (
    <nav
      aria-label="Form sections"
      className="sticky top-0 z-10 -mx-4 border-b border-[#E2E8F0] bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <div className="flex gap-1 overflow-x-auto pb-1">
        {ONBOARDING_STEPS.map((step) => {
          const done = completedSteps.includes(step.id);
          const active = step.id === currentStep;
          const clickable = Boolean(onStepClick);
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
      <p className="mt-2 text-[11px] text-[#64748B]">
        Section {currentStep} of {ONBOARDING_TOTAL_STEPS}:{" "}
        {ONBOARDING_STEPS[currentStep - 1]?.label}
      </p>
    </nav>
  );
}
