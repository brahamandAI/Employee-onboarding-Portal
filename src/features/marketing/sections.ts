export const MARKETING_SECTIONS = [
  {
    id: "home",
    label: "Home",
    eyebrow: "Welcome",
    title: "Rakshak Securitas",
    description:
      "Trusted security services with a digital employee onboarding platform — fast, secure, and transparent.",
  },
  {
    id: "about",
    label: "About",
    eyebrow: "About Us",
    title: "About Rakshak Securitas Pvt Ltd",
    description:
      "A leading security and facility management company with a digital Employee Onboarding Management System for transparent, paperless recruitment.",
  },
  {
    id: "services",
    label: "Services",
    eyebrow: "Our Services",
    title: "Our Services",
    description:
      "Professional Security, Facility Management, Manpower, and Business Support Solutions for industries, corporate organizations, healthcare, education, residential communities, and government sectors.",
  },
  {
    id: "faq",
    label: "FAQ",
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    description:
      "Common questions about joining, documents, approvals, and employee ID cards.",
  },
  {
    id: "contact",
    label: "Contact",
    eyebrow: "Contact",
    title: "Contact Rakshak Securitas Pvt Ltd",
    description:
      "HR, recruitment, employee onboarding, and technical support for candidates and employees throughout the digital onboarding journey.",
  },
] as const;

export type MarketingSectionId = (typeof MARKETING_SECTIONS)[number]["id"];

export const DEFAULT_SECTION: MarketingSectionId = "home";

export function isMarketingSection(value: string): value is MarketingSectionId {
  return MARKETING_SECTIONS.some((section) => section.id === value);
}

export function getSectionMeta(id: MarketingSectionId) {
  return MARKETING_SECTIONS.find((section) => section.id === id) ?? MARKETING_SECTIONS[0];
}

export function sectionHref(id: MarketingSectionId): string {
  return id === "home" ? "/" : `/?section=${id}`;
}
