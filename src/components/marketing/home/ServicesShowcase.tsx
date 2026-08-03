"use client";

import { SERVICE_DETAILS } from "@/features/marketing/services-content";
import { ServicesHero } from "@/components/marketing/services/ServicesHero";
import { ServiceDetailSection } from "@/components/marketing/services/ServiceDetailSection";
import { IndustriesWeServe } from "@/components/marketing/services/IndustriesWeServe";
import { ServicesWhyChoose } from "@/components/marketing/services/ServicesWhyChoose";
import { ServicesOnboardingSection } from "@/components/marketing/services/ServicesOnboardingSection";
import { ServicesCTA } from "@/components/marketing/services/ServicesCTA";
import { ServicesStickyNav } from "@/components/marketing/services/ServicesStickyNav";
import { ServicesJsonLd } from "@/components/marketing/services/ServicesJsonLd";

export function ServicesShowcase({ embedded = false }: { embedded?: boolean }) {
  if (!embedded) {
    return (
      <div className="scroll-mt-24">
        <ServicesJsonLd />
        <ServicesHero />
        <ServicesStickyNav />
        {SERVICE_DETAILS.map((service, index) => (
          <ServiceDetailSection key={service.id} service={service} index={index} />
        ))}
        <IndustriesWeServe />
        <ServicesWhyChoose />
        <ServicesOnboardingSection />
        <ServicesCTA />
      </div>
    );
  }

  return (
    <>
      <ServicesStickyNav />
      {SERVICE_DETAILS.map((service, index) => (
        <ServiceDetailSection key={service.id} service={service} index={index} />
      ))}
      <IndustriesWeServe />
      <ServicesWhyChoose />
      <ServicesOnboardingSection />
      <ServicesCTA />
    </>
  );
}
