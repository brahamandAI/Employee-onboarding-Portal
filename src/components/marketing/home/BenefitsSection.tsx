import { cn } from "@/lib/utils";
import { BENEFITS } from "@/features/marketing/site-content";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { MarketingIcon } from "@/components/marketing/MarketingIcon";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export function BenefitsSection({ embedded = false }: { embedded?: boolean }) {
  return (
    <section className={cn(embedded ? "bg-gradient-to-b from-primary to-primary-hover py-12 lg:py-16" : "bg-gradient-to-b from-primary to-primary-hover py-20 lg:py-28")}>      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <MotionReveal>
          <SectionHeading
            eyebrow="Employee Benefits"
            title="Benefits of Working With Us"
            description="Placeholder benefit descriptions — replace with official HR policy summaries."
            className="[&_h2]:text-white [&_p]:text-white/70 [&_span]:text-accent"
          />
        </MotionReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((item, i) => (
            <MotionReveal key={item.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <MarketingIcon name={item.icon} className="h-8 w-8 text-accent" />
                <h3 className="mt-4 font-heading font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
