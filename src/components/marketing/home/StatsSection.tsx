"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { COMPANY_STATS } from "@/features/marketing/site-content";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

const STAT_COLORS = [
  "from-sky-500 to-sky-700",
  "from-teal-500 to-teal-700",
  "from-amber-500 to-amber-700",
  "from-[#0B1F3A] to-[#12325C]",
  "from-emerald-500 to-emerald-700",
];

function AnimatedCounter({
  numericValue,
  displayValue,
  suffix,
}: {
  numericValue: number | null;
  displayValue: string;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { duration: 2 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  const [shown, setShown] = useState(displayValue);

  useEffect(() => {
    if (numericValue === null || !inView) return;
    spring.set(numericValue);
    return rounded.on("change", (v) => setShown(String(v)));
  }, [numericValue, inView, spring, rounded]);

  if (numericValue === null) {
    return (
      <span ref={ref} className="font-heading text-4xl font-bold text-primary lg:text-5xl">
        {displayValue}
      </span>
    );
  }

  return (
    <span ref={ref} className="font-heading text-4xl font-bold text-primary lg:text-5xl">
      {shown}
      {suffix}
    </span>
  );
}

export function StatsSection({ embedded = false }: { embedded?: boolean }) {
  return (
    <section
      className={cn(
        "border-y border-[#E2E8F0] bg-[#F8FAFC]",
        embedded ? "py-12 lg:py-16" : "py-20 lg:py-24"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {!embedded && (
          <MotionReveal>
            <SectionHeading
              align="center"
              eyebrow="Platform overview"
              title="Onboarding at a glance"
              description="Submitter registration, L1/L2 approvals, Temporary Employee ID, and automatic Employee Documents folders."
            />
          </MotionReveal>
        )}
        <div className={cn(embedded ? "grid gap-8 sm:grid-cols-2 lg:grid-cols-5" : "mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5")}>
          {COMPANY_STATS.map((stat, i) => (
            <MotionReveal key={stat.id} delay={i * 80}>
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white text-center shadow-sm transition hover:border-sky-200 hover:shadow-glow"
              >
                <div className={cn("h-1.5 bg-gradient-to-r", STAT_COLORS[i % STAT_COLORS.length])} />
                <div className="p-6">
                  <AnimatedCounter
                    numericValue={stat.numericValue}
                    displayValue={stat.displayValue}
                    suffix={stat.suffix}
                  />
                  <p className="mt-2 text-sm font-medium text-[#64748B]">{stat.label}</p>
                </div>
              </motion.div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
