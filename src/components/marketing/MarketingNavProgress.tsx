"use client";

import { cn } from "@/lib/utils";
import { useMarketingSection } from "@/features/marketing/context/MarketingSectionProvider";

export function MarketingNavProgress() {
  const { isPending } = useMarketingSection();

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent transition-transform duration-200",
        isPending ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
      )}
    />
  );
}
