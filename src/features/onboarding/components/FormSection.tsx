"use client";

import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  subtitle?: string;
  sectionNumber?: number;
  children: ReactNode;
  variant?: "default" | "office" | "highlight";
}

export function FormSection({
  title,
  subtitle,
  sectionNumber,
  children,
  variant = "default",
}: FormSectionProps) {
  const styles = {
    default: "border-[#E2E8F0] bg-white",
    office: "border-[#CBD5E1] bg-[#F8FAFC]",
    highlight: "border-sky-200 bg-[#F8FBFF]",
  };

  return (
    <section className={`rounded-2xl border shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${styles[variant]}`}>
      <div className="overflow-hidden rounded-t-2xl border-b border-[#E8EEF5] bg-[#0B1F3A] px-5 py-3.5">
        <div className="flex items-center gap-3">
          {sectionNumber !== undefined && (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-xs font-bold text-white">
              {sectionNumber}
            </span>
          )}
          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide text-white">
              {title}
            </h3>
            {subtitle && <p className="mt-0.5 text-xs text-white/70">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
