"use client";

import { SectionHeading } from "@/components/marketing/SectionHeading";
import { getSectionMeta, MarketingSectionId } from "@/features/marketing/sections";

export function SectionBanner({ sectionId }: { sectionId: MarketingSectionId }) {
  const meta = getSectionMeta(sectionId);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-violet-700 pt-24 lg:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,_rgba(251,191,36,0.2)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('/marketing/hero-pattern.svg')] bg-cover opacity-[0.06]" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-16">
        <SectionHeading
          light
          align="left"
          eyebrow={meta.eyebrow}
          title={meta.title}
          description={meta.description}
        />
      </div>
    </section>
  );
}
