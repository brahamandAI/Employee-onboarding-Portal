import {
  Shield,
  Camera,
  Users,
  Building2,
  Truck,
  ClipboardCheck,
  LucideIcon,
} from "lucide-react";
import { AnimatedReveal } from "@/components/marketing/AnimatedReveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { SERVICES } from "@/features/marketing/constants";
import Link from "next/link";

const ICONS: Record<string, LucideIcon> = {
  Shield,
  Camera,
  Users,
  Building: Building2,
  Truck,
  ClipboardCheck,
};

interface ServiceGridProps {
  limit?: number;
  showLink?: boolean;
}

export function ServiceGrid({ limit, showLink = true }: ServiceGridProps) {
  const items = limit ? SERVICES.slice(0, limit) : SERVICES;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="Our Services"
            title="Comprehensive Security Solutions"
            description="From manned guarding to technology-enabled surveillance, we protect people, property, and reputation."
          />
        </AnimatedReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service, i) => {
            const Icon = ICONS[service.icon] ?? Shield;
            return (
              <AnimatedReveal key={service.title} delay={i * 80}>
                <div className="group h-full rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-accent group-hover:text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                    {service.description}
                  </p>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>

        {showLink && limit && (
          <AnimatedReveal className="mt-10 text-center">
            <Link
              href="/services"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              View all services →
            </Link>
          </AnimatedReveal>
        )}
      </div>
    </section>
  );
}
