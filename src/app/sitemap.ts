import type { MetadataRoute } from "next";
import { SITE } from "@/features/marketing/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const pages = ["/staff/login"];

  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
