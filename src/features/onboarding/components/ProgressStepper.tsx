"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import {
  ONBOARDING_STEPS,
  ONBOARDING_TOTAL_STEPS,
} from "@/features/onboarding/constants";

interface ProgressStepperProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
}

export function ProgressStepper({
  currentStep,
  completedSteps,
  onStepClick,
}: ProgressStepperProps) {
  const progressPercent = ((currentStep - 1) / (ONBOARDING_TOTAL_STEPS - 1)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-primary">
          Step {currentStep} of {ONBOARDING_TOTAL_STEPS}
        </span>
        <span className="text-[#64748B]">
          {ONBOARDING_STEPS[currentStep - 1]?.label}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${Math.max(progressPercent, 5)}%` }}
        />
      </div>

      {/* Desktop stepper */}
      <div className="hidden lg:grid lg:grid-cols-10 lg:gap-1">
        {ONBOARDING_STEPS.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted && onStepClick;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(step.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md p-1 text-center transition-colors",
                isClickable && "cursor-pointer hover:bg-[#F1F5F9]",
                !isClickable && "cursor-default"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                  isCompleted && "bg-green-600 text-white",
                  isCurrent && !isCompleted && "bg-primary text-white",
                  !isCurrent && !isCompleted && "bg-[#E2E8F0] text-[#64748B]"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-[10px] leading-tight",
                  isCurrent ? "font-semibold text-primary" : "text-[#94A3B8]"
                )}
              >
                {step.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
