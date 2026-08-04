import { AuthLayoutShell } from "@/components/layout/auth/AuthLayoutShell";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password — Rakshak Securitas",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayoutShell title="Forgot Password">
      <ForgotPasswordForm />
    </AuthLayoutShell>
  );
}
