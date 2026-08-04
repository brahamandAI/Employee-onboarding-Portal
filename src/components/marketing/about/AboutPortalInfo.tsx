"use client";

import { Cloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPANY_STATS, PORTAL_ROLES_LIST } from "@/features/marketing/site-content";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { AnimatedCounter } from "@/components/marketing/about/AnimatedCounter";
import { ApprovalStagesTimeline } from "@/components/marketing/about/ApprovalStagesTimeline";

const STAT_ACCENTS = [
  "from-sky-600 to-sky-800",
  "from-teal-600 to-teal-800",
  "from-amber-600 to-amber-800",
  "from-primary to-[#12325C]",
  "from-emerald-600 to-emerald-800",
];

export function AboutPortalInfo() {
  const numericStats = COMPANY_STATS.filter(
    (s) => s.id === "sections" || s.id === "roles"
  );
  const cloudStat = COMPANY_STATS.find((s) => s.id === "portal");

  return (
    <div className="space-y-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {numericStats.map((stat, i) => (
          <MotionReveal key={stat.id} delay={i * 60}>
            <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-soft transition hover:border-sky-200">
              <div className={cn("h-1.5 bg-gradient-to-r", STAT_ACCENTS[i])} />
              <div className="p-6 text-center">
                <AnimatedCounter
                  numericValue={stat.numericValue}
                  displayValue={stat.displayValue}
                  suffix={stat.suffix}
                />
                <p className="mt-2 text-sm font-medium text-[#64748B]">{stat.label}</p>
              </div>
            </div>
          </MotionReveal>
        ))}

        <MotionReveal delay={120}>
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-soft sm:col-span-2 lg:col-span-2">
            <div className={cn("h-1.5 bg-gradient-to-r", STAT_ACCENTS[2])} />
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#64748B]">
                Portal Roles
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {PORTAL_ROLES_LIST.map((role) => (
                  <li
                    key={role}
                    className="rounded-lg bg-[#F8FAFC] px-3 py-2 text-sm font-medium text-primary"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </MotionReveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MotionReveal delay={150}>
          <div className="h-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-soft">
            <div className={cn("h-1.5 bg-gradient-to-r", STAT_ACCENTS[3])} />
            <div className="p-6">
              <p className="font-heading text-lg font-bold text-primary">Approval Stages</p>
              <p className="mt-1 text-sm text-[#64748B]">
                From draft submission through L2 approval, Temporary Employee ID, and document folders.
              </p>
              <div className="mt-6">
                <ApprovalStagesTimeline />
              </div>
            </div>
          </div>
        </MotionReveal>

        {cloudStat && (
          <MotionReveal delay={200}>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary via-primary to-[#0a1f38] p-8 text-white shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <Cloud className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mt-6 font-heading text-xl font-bold">
                Secure Cloud Based Employee Onboarding
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">
                The Employee Onboarding Management System runs on secure cloud infrastructure,
                enabling candidates and staff to complete registration, verification, approvals,
                and ID card processes from anywhere with role-based access controls.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/75">
                <li>• Encrypted document storage and verification</li>
                <li>• Real-time application status updates</li>
                <li>• Role-based dashboards for L1, L2, and Support teams</li>
              </ul>
            </div>
          </MotionReveal>
        )}
      </div>
    </div>
  );
}
