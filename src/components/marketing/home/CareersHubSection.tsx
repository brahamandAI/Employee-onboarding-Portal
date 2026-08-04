import Link from "next/link";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { Button } from "@/components/ui/button";
import { WhyJoinSection } from "@/components/marketing/home/WhyJoinSection";
import { RecruitmentTimeline } from "@/components/marketing/home/RecruitmentTimeline";
import { OnboardingWorkflow } from "@/components/marketing/home/OnboardingWorkflow";
import { RequiredDocumentsSection } from "@/components/marketing/home/RequiredDocumentsSection";
import { BenefitsSection } from "@/components/marketing/home/BenefitsSection";
import { CAREERS } from "@/features/marketing/site-content";

export function CareersHubSection() {
  return (
    <div className="space-y-0">
      <WhyJoinSection embedded />

      <section className="bg-[#F8FAFC] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <MotionReveal>
            <h2 className="font-heading text-2xl font-bold text-primary">Open Positions</h2>
            <p className="mt-2 max-w-2xl text-sm text-[#64748B]">
              Explore representative roles across security, facility management, and housekeeping.
              Register online to apply and complete the digital onboarding process.
            </p>
          </MotionReveal>

          <div className="mt-8 space-y-4">
            {CAREERS.map((job, i) => (
              <MotionReveal key={job.title} delay={i * 80}>
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="font-heading text-lg font-semibold text-primary">{job.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#64748B]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-accent" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-accent" />
                      {job.department} · {job.type}
                    </span>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>

          <MotionReveal delay={150} className="mt-8 flex flex-wrap gap-3">
            <Link href="/apply">
              <Button variant="accent" className="gap-2">
                Employee Registration
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </MotionReveal>
        </div>
      </section>

      <RecruitmentTimeline embedded />
      <OnboardingWorkflow embedded />
      <RequiredDocumentsSection embedded />
      <BenefitsSection embedded />
    </div>
  );
}
