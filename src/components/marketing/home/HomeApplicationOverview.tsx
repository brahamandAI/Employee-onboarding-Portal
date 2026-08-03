"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Info, Shield } from "lucide-react";
import { motion } from "framer-motion";
import {
  RECRUITMENT_STEPS,
  REQUIRED_DOCUMENTS,
} from "@/features/marketing/site-content";
import { MarketingIcon } from "@/components/marketing/MarketingIcon";
import { Button } from "@/components/ui/button";

const FORM_STEPS = [
  { step: 1, title: "For Applicant", detail: "Personal, address, education & employment details" },
  { step: 2, title: "Reference Details", detail: "Two non-relative references" },
  { step: 3, title: "Family Details", detail: "Family members for ESIC / medical records" },
  { step: 4, title: "Nominee Details", detail: "EPF / insurance nomination" },
  { step: 5, title: "Additional Particulars", detail: "Ex-serviceman & gunman (if applicable)" },
  { step: 6, title: "Document Upload", detail: "Passport photo, Aadhaar, PAN, and more" },
  { step: 7, title: "Declaration", detail: "Accept declaration and submit application" },
];

const KEY_POINTS = [
  "Click Employee Registration on the home page to open the full employment form directly.",
  "Complete all 7 sections — your progress is auto-saved at every step.",
  "Upload clear scans of all required documents (JPG, PNG, or PDF up to 5 MB).",
  "Track application status after submission — no dashboard, only status and ID card download.",
  "L1 approves and generates your employee number (e.g. RSPL-601).",
  "L2 gives final approval; Support issues your digital ID card with QR code.",
];

export function HomeApplicationOverview() {
  return (
    <section className="bg-[#F8FAFC] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Workflow */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Application Workflow
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-primary md:text-4xl">
            How Onboarding Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#64748B]">
            From registration to ID card — a clear, step-by-step process for every applicant
            and reviewer in the Rakshak Securitas EOMS.
          </p>
        </div>

        <div className="mt-12 hidden lg:block">
          <div className="relative">
            <div className="absolute left-0 right-0 top-8 h-0.5 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            <div className="grid grid-cols-8 gap-2">
              {RECRUITMENT_STEPS.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30 bg-white shadow-md">
                    <MarketingIcon name={step.icon} className="h-6 w-6 text-accent" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {step.step}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-primary">{step.title}</p>
                  <p className="mt-1 text-[10px] leading-snug text-[#64748B]">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile workflow */}
        <div className="mt-8 space-y-3 lg:hidden">
          {RECRUITMENT_STEPS.map((step) => (
            <div
              key={step.step}
              className="flex gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-accent">
                {step.step}
              </div>
              <div>
                <p className="font-semibold text-primary">{step.title}</p>
                <p className="mt-0.5 text-sm text-[#64748B]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form steps + Important info */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm lg:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-primary">Employment Form</h3>
                <p className="text-sm text-[#64748B]">7 sections matching the official paper form</p>
              </div>
            </div>
            <ol className="mt-6 space-y-3">
              {FORM_STEPS.map((item) => (
                <li
                  key={item.step}
                  className="flex gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-primary">{item.title}</p>
                    <p className="text-xs text-[#64748B]">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-primary/10 bg-primary p-6 text-white shadow-lg lg:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                <Info className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold">Important Information</h3>
                <p className="text-sm text-white/60">What every applicant should know</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {KEY_POINTS.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-white/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>
            <Link href="/apply" className="mt-8 block">
              <Button variant="accent" className="w-full gap-2 sm:w-auto">
                Employee Registration
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Required documents */}
        <div className="mt-12 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm lg:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-primary">Required Documents</h3>
              <p className="text-sm text-[#64748B]">
                Prepare these before starting Step 5 — Attachments
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {REQUIRED_DOCUMENTS.map((doc) => (
              <div
                key={doc.title}
                className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5"
              >
                <MarketingIcon name={doc.icon} className="h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm font-medium text-primary">{doc.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
