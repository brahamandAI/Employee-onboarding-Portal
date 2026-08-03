"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ChevronDown, Users } from "lucide-react";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import {
  EMPLOYEE_ONBOARDING_SECTION,
  EMPLOYEE_ONBOARDING_WORKFLOW,
} from "@/features/marketing/services-content";

export function ServicesOnboardingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="border-y border-[#E2E8F0] bg-[#F8FAFC] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <MotionReveal>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
              <Users className="h-7 w-7 text-accent" />
            </div>
            <h2 className="mt-6 font-heading text-2xl font-bold text-primary lg:text-3xl">
              {EMPLOYEE_ONBOARDING_SECTION.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#64748B]">
              {EMPLOYEE_ONBOARDING_SECTION.description}
            </p>
            <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Employee Onboarding Management System
              </p>
              <p className="mt-2 text-sm text-[#64748B]">
                Every deployed employee completes digital registration, verification,
                multi-level approval, and ID card issuance before assignment.
              </p>
            </div>
          </MotionReveal>

          <MotionReveal delay={100}>
            <div
              ref={ref}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm lg:p-8"
            >
              <p className="font-heading text-lg font-bold text-primary">Workflow</p>
              <p className="mt-1 text-sm text-[#64748B]">
                From registration to deployment
              </p>

              <ol className="relative mt-8 space-y-0">
                {EMPLOYEE_ONBOARDING_WORKFLOW.map((step, i) => (
                  <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < EMPLOYEE_ONBOARDING_WORKFLOW.length - 1 && (
                      <motion.div
                        className="absolute left-[15px] top-8 w-0.5 bg-gradient-to-b from-primary to-accent/50"
                        initial={{ height: 0 }}
                        animate={inView ? { height: "calc(100% - 0.5rem)" } : { height: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                      />
                    )}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white ring-4 ring-white">
                      {i + 1}
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <span className="text-sm font-semibold text-primary">{step}</span>
                      {i < EMPLOYEE_ONBOARDING_WORKFLOW.length - 1 && (
                        <ChevronDown className="mt-1 h-4 w-4 text-accent/60" aria-hidden />
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
