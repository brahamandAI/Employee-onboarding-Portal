import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/features/marketing/constants";

export const metadata = buildPageMetadata({
  title: "Terms of Service",
  description: `Terms of service for ${SITE.name} website and services.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-28 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-primary">Terms of Service</h1>
      <p className="mt-4 text-sm text-[#64748B]">Last updated: {new Date().toLocaleDateString("en-IN")}</p>
      <div className="mt-8 space-y-4 text-[#64748B] leading-relaxed">
        <p>
          By using the {SITE.name} website and employee onboarding portal, you agree to these terms.
          Service agreements for security contracts are governed by separate client agreements.
        </p>
        <p>
          Applicants must provide accurate information during enrollment. Misrepresentation may
          result in rejection or termination of employment.
        </p>
        <p>
          For questions regarding these terms, contact{" "}
          <a href={`mailto:${SITE.email}`} className="text-primary underline">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </article>
  );
}
