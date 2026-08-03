import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SERVICES_PAGE } from "@/features/marketing/services-content";

export const metadata = buildPageMetadata({
  title: SERVICES_PAGE.title,
  description: SERVICES_PAGE.description,
  path: "/services",
});

export default function ServicesPage() {
  redirect("/?section=services");
}
