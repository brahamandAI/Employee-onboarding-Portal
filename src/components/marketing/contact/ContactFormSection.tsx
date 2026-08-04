import { MotionReveal } from "@/components/marketing/MotionReveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ContactForm } from "@/components/marketing/ContactForm";
import { CONTACT_FORM } from "@/features/marketing/contact-content";

export function ContactFormSection() {
  return (
    <section id="contact-form" className="scroll-mt-32 border-y border-[#E2E8F0] bg-[#F8FAFC] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          <MotionReveal className="lg:col-span-2">
            <SectionHeading
              eyebrow="HR Support"
              title={CONTACT_FORM.title}
              description={CONTACT_FORM.description}
            />
            <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Response Time
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                Our HR team reviews recruitment, onboarding, and support inquiries during
                office hours. For application status, employees can also sign in to the
                portal for real-time updates.
              </p>
            </div>
          </MotionReveal>

          <MotionReveal delay={100} className="lg:col-span-3">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm lg:p-8">
              <ContactForm />
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
