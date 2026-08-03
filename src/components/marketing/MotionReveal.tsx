"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface MotionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
}

const variants: Record<string, Variants> = {
  up: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } },
  none: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ duration: 0.32, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
