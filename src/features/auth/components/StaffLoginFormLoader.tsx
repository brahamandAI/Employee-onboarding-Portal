"use client";

import dynamic from "next/dynamic";

const StaffLoginForm = dynamic(
  () =>
    import("@/features/auth/components/StaffLoginForm").then(
      (mod) => mod.StaffLoginForm
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-72 w-full animate-pulse rounded-xl bg-[#F1F5F9]"
        aria-busy="true"
        aria-live="polite"
      />
    ),
  }
);

export function StaffLoginFormLoader() {
  return <StaffLoginForm />;
}
