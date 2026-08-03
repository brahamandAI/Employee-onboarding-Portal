import { AuthLayoutShell } from "@/components/layout/auth/AuthLayoutShell";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const metadata = {
  title: "Reset Password — Rakshak Securitas",
};

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <AuthLayoutShell variant="staff">
      <ResetPasswordPageContent searchParams={searchParams} />
    </AuthLayoutShell>
  );
}

async function ResetPasswordPageContent({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">
          Invalid reset link. Please request a new password reset.
        </p>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}
