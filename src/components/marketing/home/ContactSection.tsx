"use client";

import { ContactHero } from "@/components/marketing/contact/ContactHero";
import { ContactStickyNav } from "@/components/marketing/contact/ContactStickyNav";
import { ContactInfoCards } from "@/components/marketing/contact/ContactInfoCards";
import { ContactMapSection } from "@/components/marketing/contact/ContactMapSection";
import { ContactFormSection } from "@/components/marketing/contact/ContactFormSection";
import { ContactHelpDesk } from "@/components/marketing/contact/ContactHelpDesk";
import { ContactRecruitmentSection } from "@/components/marketing/contact/ContactRecruitmentSection";
import { ContactWhyChoose } from "@/components/marketing/contact/ContactWhyChoose";
import { ContactFAQ } from "@/components/marketing/contact/ContactFAQ";
import { ContactCTA } from "@/components/marketing/contact/ContactCTA";
import { ContactJsonLd } from "@/components/marketing/contact/ContactJsonLd";

export function ContactSection() {
  return (
    <div className="scroll-mt-24">
      <ContactJsonLd />
      <ContactHero />
      <ContactStickyNav />
      <ContactInfoCards />
      <ContactMapSection />
      <ContactFormSection />
      <ContactHelpDesk />
      <ContactRecruitmentSection />
      <ContactWhyChoose />
      <ContactFAQ />
      <ContactCTA />
    </div>
  );
}
