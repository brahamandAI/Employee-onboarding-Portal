"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, FileCheck, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/features/marketing/site-content";
import { useMarketingSection } from "@/features/marketing/context/MarketingSectionProvider";

const HIGHLIGHTS = [
  { icon: FileCheck, label: "Digital Forms", color: "bg-blue-500/20 text-blue-100 border-blue-400/30" },
  { icon: Users, label: "L1 / L2 Workflow", color: "bg-emerald-500/20 text-emerald-100 border-emerald-400/30" },
  { icon: Shield, label: "Secure Documents", color: "bg-violet-500/20 text-violet-100 border-violet-400/30" },
  { icon: Zap, label: "Fast Onboarding", color: "bg-amber-500/20 text-amber-100 border-amber-400/30" },
];

export function HeroSection() {
  const { setSection } = useMarketingSection();

  return (
    <section className="relative min-h-[88vh] overflow-hidden pt-16 lg:pt-[4.5rem]">
      <Image
        src={SITE.heroImage}
        alt=""
        fill
        priority
        className="object-cover opacity-25"
        aria-hidden
      />

      {/* Colorful gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-blue-700 to-teal-600" />
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/40 via-transparent to-amber-500/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,_rgba(251,191,36,0.35)_0%,_transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(167,139,250,0.4)_0%,_transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_90%,_rgba(45,212,191,0.35)_0%,_transparent_45%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent" />

      {/* Floating color orbs */}
      <div className="pointer-events-none absolute left-[10%] top-[20%] h-40 w-40 rounded-full bg-rose-400/25 blur-3xl" />
      <div className="pointer-events-none absolute right-[12%] top-[30%] h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[20%] left-[40%] h-36 w-36 rounded-full bg-amber-300/25 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(88vh-4rem)] max-w-7xl flex-col justify-center px-4 py-14 lg:px-8">
        <div className="flex animate-fade-in items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-300 to-orange-400 shadow-xl shadow-amber-500/30 ring-2 ring-white/20">
            <Shield className="h-8 w-8 text-indigo-900" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-200">
              Employee Onboarding System
            </p>
            <p className="font-heading text-lg font-bold text-white sm:text-xl">
              {SITE.legalName}
            </p>
          </div>
        </div>

        <h1 className="mt-7 max-w-4xl animate-fade-in font-heading text-4xl font-bold leading-[1.12] tracking-tight text-white [animation-delay:100ms] sm:text-5xl lg:text-[3.25rem]">
          {SITE.tagline}
        </h1>

        <p className="mt-5 max-w-2xl animate-fade-in text-base leading-relaxed text-white/85 [animation-delay:200ms] lg:text-lg">
          {SITE.intro}
        </p>

        <div className="mt-7 flex animate-fade-in flex-wrap gap-2.5 [animation-delay:280ms]">
          {HIGHLIGHTS.map((item) => (
            <span
              key={item.label}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm backdrop-blur-sm ${item.color}`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </span>
          ))}
        </div>

        <div className="mt-9 flex animate-fade-in flex-wrap gap-3 [animation-delay:360ms]">
          <Link href="/apply">
            <Button
              size="lg"
              className="gap-2 border-0 bg-gradient-to-r from-amber-400 to-orange-400 text-indigo-950 shadow-lg shadow-amber-500/30 hover:from-amber-300 hover:to-orange-300"
            >
              Employee Registration
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            type="button"
            size="lg"
            onClick={() => setSection("about")}
            className="border-white/30 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
          >
            About Us
          </Button>
          <Button
            type="button"
            size="lg"
            variant="ghost"
            onClick={() => setSection("contact")}
            className="text-white/90 hover:bg-white/15 hover:text-white"
          >
            Contact
          </Button>
        </div>
      </div>
    </section>
  );
}
