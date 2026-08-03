"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ChevronDown, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { RECRUITMENT_SUPPORT } from "@/features/marketing/contact-content";

export function ContactRecruitmentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="recruitment"
      className="scroll-mt-32 border-y border-[#E2E8F0] bg-gradient-to-br from-primary via-primary to-[#0a1f38] py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <MotionReveal>
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">
              Recruitment Support
            </span>
            <h2 className="mt-3 font-heading text-2xl font-bold text-white lg:text-3xl">
              {RECRUITMENT_SUPPORT.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              {RECRUITMENT_SUPPORT.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/apply">
                <Button variant="accent" size="lg" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Start Registration
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-white/30 bg-white/5 text-white hover:bg-white/10"
                >
                  <LogIn className="h-4 w-4" />
                  Employee Login
                </Button>
              </Link>
            </div>
          </MotionReveal>

          <MotionReveal delay={100}>
            <div
              ref={ref}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:p-8"
            >
              <p className="font-heading text-lg font-bold text-white">Workflow</p>
              <p className="mt-1 text-sm text-white/70">
                End-to-end digital onboarding
              </p>

              <ol className="relative mt-8 space-y-0">
                {RECRUITMENT_SUPPORT.workflow.map((step, i) => (
                  <li key={step} className="relative flex gap-4 pb-5 last:pb-0">
                    {i < RECRUITMENT_SUPPORT.workflow.length - 1 && (
                      <motion.div
                        className="absolute left-[15px] top-8 w-0.5 bg-gradient-to-b from-accent to-white/30"
                        initial={{ height: 0 }}
                        animate={inView ? { height: "calc(100% - 0.5rem)" } : { height: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                      />
                    )}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary ring-4 ring-primary">
                      {i + 1}
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <span className="text-sm font-semibold text-white">{step}</span>
                      {i < RECRUITMENT_SUPPORT.workflow.length - 1 && (
                        <ChevronDown className="mt-1 h-4 w-4 text-accent/70" aria-hidden />
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
