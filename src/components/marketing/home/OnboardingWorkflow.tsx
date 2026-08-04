"use client";

import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { ONBOARDING_WORKFLOW } from "@/features/marketing/site-content";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export function OnboardingWorkflow({ embedded = false }: { embedded?: boolean }) {
  return (
    <section
      className={cn(
        embedded ? "bg-[#F4F7FB] py-12 lg:py-16" : "bg-[#F4F7FB] py-20 lg:py-28"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <MotionReveal>
          <SectionHeading
            eyebrow="Process flow"
            title="Employee onboarding workflow"
            description="How a registration moves from submitter to L2 approval and Employee Documents."
          />
        </MotionReveal>

        <div className="mt-12 flex flex-col items-center gap-4 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-2">
          {ONBOARDING_WORKFLOW.map((step, i) => (
            <MotionReveal
              key={step.title}
              delay={i * 70}
              className="flex flex-col items-center lg:flex-row"
            >
              <motion.div
                whileHover={{ y: -4 }}
                className="w-full min-w-[200px] max-w-xs rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center shadow-soft transition hover:border-sky-200 lg:w-44"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-700 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-3 font-heading text-sm font-semibold text-primary">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{step.description}</p>
              </motion.div>
              {i < ONBOARDING_WORKFLOW.length - 1 && (
                <ArrowDown
                  className="my-2 h-5 w-5 shrink-0 text-sky-400 lg:mx-1 lg:rotate-[-90deg]"
                  aria-hidden
                />
              )}
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
