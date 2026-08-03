"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

export function AnimatedCounter({
  numericValue,
  displayValue,
  suffix = "",
}: {
  numericValue: number | null;
  displayValue: string;
  suffix?: string;
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
      <span ref={ref} className="font-heading text-3xl font-bold text-primary lg:text-4xl">
        {displayValue}
      </span>
    );
  }

  return (
    <span ref={ref} className="font-heading text-3xl font-bold text-primary lg:text-4xl">
      {shown}
      {suffix}
    </span>
  );
}
