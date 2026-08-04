"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { APPROVAL_STAGES_LIST } from "@/features/marketing/site-content";
import { MotionReveal } from "@/components/marketing/MotionReveal";

export function ApprovalStagesTimeline({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/20 via-primary to-accent/60 sm:left-6" />
      <motion.div
        className="absolute left-4 top-2 w-0.5 bg-gradient-to-b from-primary to-accent sm:left-6"
        initial={{ height: 0 }}
        animate={inView ? { height: "calc(100% - 1rem)" } : { height: 0 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />

      <ol className="space-y-4">
        {APPROVAL_STAGES_LIST.map((stage, i) => (
          <MotionReveal key={stage} delay={i * 50}>
            <li className="relative flex items-start gap-4 pl-10 sm:pl-14">
              <span className="absolute left-2.5 top-1 flex h-3 w-3 rounded-full border-2 border-white bg-primary shadow-sm ring-2 ring-primary/20 sm:left-[1.125rem]" />
              <div className="flex-1 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span className="text-sm font-semibold text-primary">{stage}</span>
                </div>
              </div>
            </li>
          </MotionReveal>
        ))}
      </ol>
    </div>
  );
}
