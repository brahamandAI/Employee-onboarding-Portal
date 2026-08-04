"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";

export function AuthLayoutShell({
  children,
  title = "Sign In",
  showBackHome = true,
}: {
  children: React.ReactNode;
  /** @deprecated Kept for call-site compatibility */
  variant?: "employee" | "staff";
  title?: string;
  showBackHome?: boolean;
}) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#EEF3F9] px-4 py-10 sm:px-6">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-15%,rgba(14,165,233,0.18),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_90%,rgba(11,31,58,0.1),transparent_50%),radial-gradient(ellipse_45%_35%_at_0%_85%,rgba(212,175,55,0.14),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(rgba(11,31,58,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(11,31,58,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="pointer-events-none absolute -left-16 top-24 h-56 w-56 animate-float rounded-full bg-sky-400/25 blur-3xl" />
      <div
        className="pointer-events-none absolute -right-10 bottom-20 h-64 w-64 animate-float rounded-full bg-[#D4AF37]/20 blur-3xl"
        style={{ animationDelay: "1.2s" }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 animate-float rounded-full bg-[#0B1F3A]/10 blur-3xl"
        style={{ animationDelay: "0.6s" }}
      />

      <div className="relative z-10 w-full max-w-[440px] animate-rise">
        {showBackHome && (
          <div className="mb-4 animate-fade-in">
            <Link
              href="/"
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-[#D0DAE6] bg-white/90 px-3.5 py-2",
                "text-sm font-medium text-[#334155] shadow-sm backdrop-blur-sm",
                "transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white hover:text-[#0B1F3A] hover:shadow-md"
              )}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
          </div>
        )}

        <div className="overflow-hidden rounded-[1.6rem] border border-[#DCE5F0] bg-white/95 shadow-[0_28px_70px_-34px_rgba(11,31,58,0.5)] backdrop-blur-md">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0B1F3A] via-[#0EA5E9] to-[#D4AF37]" />

          <div className="px-7 pb-8 pt-7 sm:px-9 sm:pb-9 sm:pt-8">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="flex w-full justify-center rounded-2xl bg-gradient-to-b from-[#F8FBFF] to-white px-3 py-3 ring-1 ring-[#E8EEF6]">
                <BrandLogo
                  href="/"
                  variant="dark"
                  priority
                  className="mx-auto w-full max-w-[270px] justify-center"
                />
              </div>
              <h1 className="mt-6 font-heading text-[1.4rem] font-bold tracking-tight text-[#0B1F3A] sm:text-[1.5rem]">
                {title}
              </h1>
              <div className="mt-2.5 h-1 w-12 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#D4AF37]" />
            </div>

            {children}
          </div>
        </div>

        <p className="mt-5 animate-fade-in text-center text-xs text-[#94A3B8] stagger-3">
          © {new Date().getFullYear()} Rakshak Securitas Pvt. Ltd.
        </p>
      </div>
    </div>
  );
}
