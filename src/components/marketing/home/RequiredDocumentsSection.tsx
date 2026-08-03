import { cn } from "@/lib/utils";
import { REQUIRED_DOCUMENTS } from "@/features/marketing/site-content";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { MarketingIcon } from "@/components/marketing/MarketingIcon";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export function RequiredDocumentsSection({ embedded = false }: { embedded?: boolean }) {
  return (
    <section className={cn(embedded ? "bg-white py-12 lg:py-16" : "scroll-mt-24 bg-white py-20 lg:py-28")}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <MotionReveal>
          <SectionHeading
            eyebrow="Documentation"
            title="Required Documents"
            description="Prepare these documents before starting your online employment application."
          />
        </MotionReveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {REQUIRED_DOCUMENTS.map((doc, i) => (
            <MotionReveal key={doc.title} delay={i * 40}>
              <div className="flex items-center gap-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-accent">
                  <MarketingIcon name={doc.icon} className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-primary">{doc.title}</span>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
