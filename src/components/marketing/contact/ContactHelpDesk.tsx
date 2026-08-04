import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { MarketingIcon } from "@/components/marketing/MarketingIcon";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { EMPLOYEE_HELP_DESK } from "@/features/marketing/contact-content";

export function ContactHelpDesk() {
  return (
    <section id="help-desk" className="scroll-mt-32 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <MotionReveal>
          <SectionHeading
            align="center"
            eyebrow="Support"
            title={EMPLOYEE_HELP_DESK.title}
            description={EMPLOYEE_HELP_DESK.description}
          />
        </MotionReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EMPLOYEE_HELP_DESK.items.map((item, i) => (
            <MotionReveal key={item.title} delay={i * 50}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <MarketingIcon name={item.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#64748B]">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
