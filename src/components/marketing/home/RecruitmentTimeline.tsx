"use client";

import { cn } from "@/lib/utils";
import { RECRUITMENT_STEPS } from "@/features/marketing/site-content";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { MarketingIcon } from "@/components/marketing/MarketingIcon";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function RecruitmentTimeline({ embedded = false }: { embedded?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className={cn(embedded ? "bg-primary py-12 lg:py-16" : "scroll-mt-24 bg-primary py-20 lg:py-28")}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <MotionReveal>
          <SectionHeading
            eyebrow="Join Our Team"
            title="Recruitment Process"
            description="Transparent step-by-step journey from registration to successful onboarding."
            className="[&_h2]:text-white [&_p]:text-white/70 [&_span]:text-accent"
          />
        </MotionReveal>
        <div ref={ref} className="relative mt-16">
          <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-accent/30 lg:left-1/2 lg:-ml-px lg:block" />
          <motion.div
            className="absolute left-6 top-0 hidden w-0.5 bg-accent lg:left-1/2 lg:-ml-px lg:block"
            initial={{ height: 0 }}
            animate={inView ? { height: "100%" } : { height: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          <div className="space-y-8 lg:space-y-0">
            {RECRUITMENT_STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <MotionReveal key={step.step} delay={i * 80}>
                  <div
                    className={`relative flex flex-col gap-4 lg:flex-row lg:items-center ${
                      isLeft ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`lg:w-1/2 ${isLeft ? "lg:pl-12 lg:text-right" : "lg:pr-12"}`}>
                      <div
                        className={`rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10 ${
                          isLeft ? "lg:ml-auto lg:max-w-md" : "lg:max-w-md"
                        }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">
                          Step {step.step}
                        </span>
                        <h3 className="mt-2 font-heading text-lg font-bold text-white">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/70">{step.description}</p>
                      </div>
                    </div>

                    <div className="absolute left-0 flex lg:left-1/2 lg:-translate-x-1/2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={inView ? { scale: 1 } : { scale: 0 }}
                        transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-primary text-accent shadow-lg shadow-accent/20"
                      >
                        <MarketingIcon name={step.icon} className="h-5 w-5" />
                      </motion.div>
                    </div>

                    <div className="hidden lg:block lg:w-1/2" />
                  </div>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
