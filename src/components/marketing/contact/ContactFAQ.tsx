"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MotionReveal } from "@/components/marketing/MotionReveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { CONTACT_FAQ_ITEMS } from "@/features/marketing/contact-content";
import { cn } from "@/lib/utils";

export function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="contact-faq" className="scroll-mt-32 bg-[#F8FAFC] py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <MotionReveal>
          <SectionHeading
            align="center"
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            description="Answers to common questions about registration, documents, approvals, and HR contact."
          />
        </MotionReveal>

        <div className="mt-10 space-y-3">
          {CONTACT_FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <MotionReveal key={item.question} delay={i * 40}>
                <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading text-sm font-semibold text-primary">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-primary transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="border-t border-[#E2E8F0] px-5 py-4 text-sm leading-relaxed text-[#64748B]">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
