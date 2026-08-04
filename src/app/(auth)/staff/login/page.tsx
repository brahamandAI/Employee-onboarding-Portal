import { AuthLayoutShell } from "@/components/layout/auth/AuthLayoutShell";
import { StaffLoginFormLoader } from "@/features/auth/components/StaffLoginFormLoader";

export const metadata = {
  title: "Staff Login — Rakshak Securitas",
};

export default function StaffLoginPage() {
  return (
    <AuthLayoutShell title="Sign In">
      <StaffLoginFormLoader />
    </AuthLayoutShell>
  );
}
