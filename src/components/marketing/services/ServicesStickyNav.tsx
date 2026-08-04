"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SERVICE_DETAILS } from "@/features/marketing/services-content";

export function ServicesStickyNav() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const ids = SERVICE_DETAILS.map((s) => s.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav
      aria-label="Service sections"
      className="sticky top-16 z-30 border-b border-[#E2E8F0] bg-white/95 shadow-sm backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 lg:px-8">
        <ul className="flex gap-1 py-2">
          {SERVICE_DETAILS.map((service) => (
            <li key={service.id} className="shrink-0">
              <Link
                href={`#${service.id}`}
                className={cn(
                  "inline-block rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
                  activeId === service.id
                    ? "bg-primary text-white"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-primary"
                )}
              >
                {service.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
