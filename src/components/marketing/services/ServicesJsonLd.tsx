import { SITE } from "@/features/marketing/site-content";
import { SERVICE_DETAILS, SERVICES_PAGE } from "@/features/marketing/services-content";

export function ServicesJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SERVICES_PAGE.title,
    description: SERVICES_PAGE.description,
    url: `${SITE.url}/?section=services`,
    itemListElement: SERVICE_DETAILS.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: {
          "@type": "Organization",
          name: SITE.legalName,
          url: SITE.url,
        },
        areaServed: "IN",
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
