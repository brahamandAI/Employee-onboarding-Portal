"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FolderOpen, Shield, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/features/marketing/site-content";
import { useMarketingSection } from "@/features/marketing/context/MarketingSectionProvider";

const HIGHLIGHTS = [
  { icon: CheckCircle2, label: "Digital Registration" },
  { icon: Shield, label: "Secure Approvals" },
  { icon: FolderOpen, label: "Employee Documents" },
  { icon: Users, label: "Role-Based Access" },
];

export function HeroSection() {
  const { setSection } = useMarketingSection();

  return (
    <section className="relative min-h-[90vh] overflow-hidden pt-16 lg:pt-[4.5rem]">
      <Image
        src={SITE.heroImage}
        alt=""
        fill
        priority
        className="object-cover opacity-20"
        aria-hidden
      />
      <div className="marketing-mesh absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,#F4F7FB_100%)]" />

      <div className="pointer-events-none absolute left-[8%] top-[22%] h-44 w-44 animate-float rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-[28%] h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[24%] left-[42%] h-40 w-40 rounded-full bg-teal-500/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(90vh-4rem)] max-w-7xl flex-col justify-center px-4 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="animate-fade-in text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            Rakshak Securitas · Employee Onboarding Portal
          </p>

          <h1 className="mt-5 animate-fade-in font-heading text-4xl font-bold leading-[1.08] tracking-tight text-white stagger-1 sm:text-5xl lg:text-[3.4rem]">
            {SITE.legalName}
          </h1>

          <p className="mt-4 max-w-2xl animate-fade-in font-heading text-xl font-semibold text-sky-100/95 stagger-2 sm:text-2xl">
            {SITE.tagline}
          </p>

          <p className="mt-5 max-w-xl animate-fade-in text-base leading-relaxed text-white/80 stagger-3 lg:text-lg">
            {SITE.intro}
          </p>

          <div className="mt-8 flex animate-fade-in flex-wrap gap-2.5 stagger-4">
            {HIGHLIGHTS.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm text-white/90 backdrop-blur-sm"
              >
                <item.icon className="h-3.5 w-3.5 text-accent" />
                {item.label}
              </span>
            ))}
          </div>

          <div className="mt-10 flex animate-fade-in flex-wrap gap-3 stagger-5">
            <Link href="/staff/login">
              <Button
                size="lg"
                className="gap-2 border-0 bg-accent text-[#0B1F3A] shadow-lg shadow-accent/25 hover:bg-[#E8D5A3]"
              >
                Staff Login
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              type="button"
              size="lg"
              onClick={() => setSection("about")}
              className="border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              How it works
            </Button>
            <Button
              type="button"
              size="lg"
              variant="ghost"
              onClick={() => setSection("contact")}
              className="text-white/90 hover:bg-white/10 hover:text-white"
            >
              Contact
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
