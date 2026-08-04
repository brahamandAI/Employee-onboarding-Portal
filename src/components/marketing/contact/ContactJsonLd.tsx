import { SITE } from "@/features/marketing/site-content";
import {
  CONTACT_PAGE,
  CORPORATE_OFFICE,
  HR_CONTACT,
} from "@/features/marketing/contact-content";

export function ContactJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: CONTACT_PAGE.title,
    description: CONTACT_PAGE.subtitle,
    url: `${SITE.url}/?section=contact`,
    mainEntity: {
      "@type": "Organization",
      name: SITE.legalName,
      url: HR_CONTACT.website,
      email: [HR_CONTACT.recruitmentEmail, HR_CONTACT.generalEmail],
      telephone: [HR_CONTACT.mobile, HR_CONTACT.office],
      address: {
        "@type": "PostalAddress",
        streetAddress: CORPORATE_OFFICE.lines.slice(0, 2).join(", "),
        addressLocality: "Dwarka, New Delhi",
        postalCode: "110075",
        addressCountry: "IN",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
