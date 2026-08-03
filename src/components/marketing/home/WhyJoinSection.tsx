import { WHY_JOIN } from "@/features/marketing/site-content";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { cn } from "@/lib/utils";

export function WhyJoinSection({ embedded = false }: { embedded?: boolean }) {
  return (
    <section className={cn(embedded ? "bg-white py-12 lg:py-16" : "bg-white py-20 lg:py-28")}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <MotionReveal direction="left">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Why Join Us
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-primary lg:text-4xl">
              {WHY_JOIN.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#64748B]">{WHY_JOIN.description}</p>
          </MotionReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {WHY_JOIN.points.map((point, i) => (
              <MotionReveal key={point.title} delay={i * 60} direction="right">
                <div className="rounded-xl border border-[#E2E8F0] p-5 shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="font-heading text-sm font-semibold text-primary">{point.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#64748B]">{point.description}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
