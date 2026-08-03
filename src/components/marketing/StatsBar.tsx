import { AnimatedReveal } from "@/components/marketing/AnimatedReveal";
import { STATS } from "@/features/marketing/constants";

export function StatsBar() {
  return (
    <section className="border-y border-[#E2E8F0] bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <AnimatedReveal key={stat.label} delay={i * 100} className="text-center">
              <p className="font-heading text-3xl font-bold text-primary md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-[#64748B]">{stat.label}</p>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
