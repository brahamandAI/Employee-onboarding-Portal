import { Suspense } from "react";
import { AuthLayoutShell } from "@/components/layout/auth/AuthLayoutShell";
import { StaffLoginForm } from "@/features/auth/components/StaffLoginForm";

export const metadata = {
  title: "Staff Login — Rakshak Securitas",
};

export default function StaffLoginPage() {
  return (
    <AuthLayoutShell variant="staff">
      <Suspense
        fallback={
          <div className="h-96 w-full max-w-md animate-pulse rounded-xl bg-white/80" />
        }
      >
        <StaffLoginForm />
      </Suspense>
    </AuthLayoutShell>
  );
}














