import { cn } from "@/lib/utils";
import { WHY_CHOOSE } from "@/features/marketing/site-content";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { MarketingIcon } from "@/components/marketing/MarketingIcon";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export function WhyChooseSection({ embedded = false }: { embedded?: boolean }) {
  return (
    <section className={cn(embedded ? "bg-[#F8FAFC] py-12 lg:py-16" : "bg-[#F8FAFC] py-20 lg:py-28")}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {!embedded && (
          <MotionReveal>
            <SectionHeading
              eyebrow="Why Rakshak"
              title="Why Choose Rakshak Securitas"
              description="Trusted security and facility management backed by disciplined operations and digital workforce systems."
            />
          </MotionReveal>
        )}
        <div className={cn(embedded ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-4" : "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4")}>
          {WHY_CHOOSE.map((item, i) => (
            <MotionReveal key={item.title} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <MarketingIcon name={item.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{item.description}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
