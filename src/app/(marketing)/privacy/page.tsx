import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/features/marketing/constants";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE.name} website and employee onboarding portal.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-28 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-primary">Privacy Policy</h1>
      <p className="mt-4 text-sm text-[#64748B]">Last updated: {new Date().toLocaleDateString("en-IN")}</p>
      <div className="prose prose-slate mt-8 max-w-none space-y-4 text-[#64748B]">
        <p>
          {SITE.name} respects your privacy. Information collected through our website contact forms
          and employee onboarding portal is used solely for recruitment, employment, and client
          service purposes.
        </p>
        <p>
          We do not sell personal data to third parties. Employee documents uploaded during
          onboarding are stored securely and accessed only by authorized personnel.
        </p>
        <p>
          For privacy-related inquiries, contact us at{" "}
          <a href={`mailto:${SITE.email}`} className="text-primary underline">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </article>
  );
}
