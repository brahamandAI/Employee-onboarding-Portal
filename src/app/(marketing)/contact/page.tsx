import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { CONTACT_PAGE } from "@/features/marketing/contact-content";

export const metadata = buildPageMetadata({
  title: CONTACT_PAGE.title,
  description: CONTACT_PAGE.subtitle,
  path: "/contact",
});

export default function ContactPage() {
  redirect("/?section=contact");
}
