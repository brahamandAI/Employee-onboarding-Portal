import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function AuthLayoutShell({
  children,
  variant = "staff",
}: {
  children: React.ReactNode;
  variant?: "employee" | "staff";
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#F1F5F9]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(29,78,216,0.16),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(14,165,233,0.12),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] [background-size:28px_28px]" />

      <header className="relative z-10 border-b border-white/60 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <BrandLogo href="/" variant="dark" priority className="max-w-[260px] sm:max-w-[300px]" />
          <Link
            href="/"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-[#64748B] transition hover:bg-[#EFF6FF] hover:text-[#1D4ED8]"
          >
            Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="grid w-full max-w-4xl animate-rise overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-[0_20px_60px_-30px_rgba(30,58,138,0.45)] sm:grid-cols-[1.05fr_1fr]">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0B1F3A] via-[#12325C] to-[#1D4ED8] p-10 text-white sm:flex sm:flex-col sm:justify-between">
            <div className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 left-6 h-40 w-40 rounded-full bg-sky-300/20 blur-2xl" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-100/90">
                Rakshak EOMS
              </p>
              <h1 className="mt-5 font-heading text-3xl font-bold leading-tight">
                {variant === "staff" ? "Welcome back" : "Employee Registration"}
              </h1>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-blue-100/85">
                {variant === "staff"
                  ? "Sign in with your role to continue securely."
                  : "Complete the employment form to apply."}
              </p>
              {variant === "staff" && (
                <ul className="mt-8 space-y-2.5 text-sm text-blue-50/90">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Role-based dashboards
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Fast approvals & tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Secure staff access only
                  </li>
                </ul>
              )}
            </div>
            <p className="relative text-xs text-blue-100/70">
              Authorized staff access · Rakshak Securitas
            </p>
          </div>

          <div className="flex w-full flex-col justify-center p-6 sm:p-10">
            <div className="mb-6">
              <h2 className="font-heading text-2xl font-bold text-[#0F172A]">
                {variant === "staff" ? "Sign In" : "Employee Registration"}
              </h2>
              <p className="mt-1.5 text-sm text-[#64748B]">
                {variant === "staff"
                  ? "Select your role, then enter email and password."
                  : "Complete the employment form to apply."}
              </p>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
