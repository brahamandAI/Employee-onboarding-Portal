import { Suspense } from "react";
import {
  MarketingNavbar,
  MarketingNavbarFallback,
} from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingSectionProvider } from "@/features/marketing/context/MarketingSectionProvider";
import { MarketingNavProgress } from "@/components/marketing/MarketingNavProgress";
import { organizationJsonLd } from "@/lib/seo/metadata";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <Suspense fallback={<MarketingNavbarFallback />}>
        <MarketingSectionProvider>
          <MarketingNavProgress />
          <MarketingNavbar />
          <main>{children}</main>
          <MarketingFooter />
        </MarketingSectionProvider>
      </Suspense>
    </>
  );
}
