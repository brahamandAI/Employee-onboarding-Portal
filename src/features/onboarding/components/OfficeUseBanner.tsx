"use client";

import { FormSection } from "@/features/onboarding/components/FormSection";

export function OfficeUseBanner() {
  return (
    <FormSection
      title="For Office Use Only"
      subtitle="This section will be completed by HR after your application is processed."
      variant="office"
    >
      <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {[
          "ID Card No.", "Employee Name", "Post", "Site", "Date of Joining", "Salary",
          "ESIC No.", "UAN No.", "Bank A/c No.", "Bank Name", "IFSC Code",
          "PSARA Certificate", "Medical Certificate", "Police Verification",
        ].map((label) => (
          <div key={label} className="rounded-md border border-dashed border-[#CBD5E1] bg-white/60 px-3 py-2">
            <span className="text-xs font-medium text-[#64748B]">{label}</span>
            <div className="mt-1 h-5 border-b border-dotted border-[#94A3B8]" />
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs italic text-[#64748B]">
        Police verification to be submitted within 15 days from date of joining.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
        All particulars are recorded electronically through the official Employee Onboarding
        Portal of Rakshak Securitas Pvt Ltd.
      </p>
    </FormSection>
  );
}
