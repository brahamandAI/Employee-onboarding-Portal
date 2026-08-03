import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/features/marketing/site-content";
import { MarketingPage } from "@/components/marketing/MarketingPage";

export const metadata = buildPageMetadata({
  title: "Home",
  description: SITE.description,
  path: "/",
});

export default function HomePage() {
  return <MarketingPage />;
}
