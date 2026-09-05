import { AuthLayoutShell } from "@/components/layout/auth/AuthLayoutShell";
import { StaffLoginForm } from "@/features/auth/components/StaffLoginForm";
import { UserRole } from "@/types/enums";

export const metadata = {
  title: "Staff Login — Rakshak Securitas",
};

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string; role?: string }>;
}

export default async function StaffLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <AuthLayoutShell title="Sign In">
      <StaffLoginForm
        initialCallbackUrl={params.callbackUrl ?? ""}
        initialRole={params.role ?? UserRole.SUBMITTER}
      />
    </AuthLayoutShell>
  );
}
