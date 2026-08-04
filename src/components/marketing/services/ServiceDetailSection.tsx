"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import type { ServiceDetail } from "@/features/marketing/services-content";

interface ServiceDetailSectionProps {
  service: ServiceDetail;
  index: number;
}

export function ServiceDetailSection({ service, index }: ServiceDetailSectionProps) {
  const imageRight = index % 2 === 1;

  return (
    <section
      id={service.id}
      className={cn(
        "scroll-mt-24 py-16 lg:py-20",
        index % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div
          className={cn(
            "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
            imageRight && "lg:[&>*:first-child]:order-2"
          )}
        >
          <MotionReveal delay={50}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-lg bg-white/95 px-4 py-2 shadow-md backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Rakshak Securitas
                </p>
                <p className="font-heading text-sm font-bold text-primary">{service.title}</p>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={100}>
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-accent">
                Service {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-2 font-heading text-2xl font-bold text-primary lg:text-3xl">
                {service.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#475569]">
                {service.description}
              </p>

              <div className="mt-8">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                  {service.industries ? "Key Responsibilities" : "Service Includes"}
                </h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {service.responsibilities.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-[#64748B]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {service.industries && service.industries.length > 0 && (
                <div className="mt-8">
                  <h3 className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                    <Building2 className="h-4 w-4 text-accent" />
                    Industries Served
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.industries.map((industry) => (
                      <span
                        key={industry}
                        className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-primary shadow-sm"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <h3 className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Benefits
                </h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {service.benefits.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#64748B] shadow-sm"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Link href="/?section=contact">
                  <Button className="gap-2">
                    Request Service
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
