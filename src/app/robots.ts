import type { MetadataRoute } from "next";
import { SITE } from "@/features/marketing/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/staff/", "/onboarding/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
