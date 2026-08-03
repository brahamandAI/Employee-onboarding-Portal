import { MotionReveal } from "@/components/marketing/MotionReveal";
import { MarketingIcon } from "@/components/marketing/MarketingIcon";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { INDUSTRIES_WE_SERVE } from "@/features/marketing/services-content";

export function IndustriesWeServe() {
  return (
    <section className="border-y border-[#E2E8F0] bg-gradient-to-br from-primary via-primary to-[#0a1f38] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <MotionReveal>
          <SectionHeading
            light
            align="center"
            eyebrow="Sectors"
            title="Industries We Serve"
            description="Delivering security and facility management solutions across diverse sectors throughout India."
          />
        </MotionReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {INDUSTRIES_WE_SERVE.map((industry, i) => (
            <MotionReveal key={industry.title} delay={i * 40}>
              <div className="group flex h-full flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent transition-colors group-hover:bg-accent group-hover:text-primary">
                  <MarketingIcon name={industry.icon} className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-heading text-sm font-semibold text-white">
                  {industry.title}
                </h3>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
