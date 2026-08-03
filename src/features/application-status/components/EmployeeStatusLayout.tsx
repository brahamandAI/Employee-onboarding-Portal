"use client";

import { useState, useTransition } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { employeeLogoutAction } from "@/features/auth/actions/auth.actions";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { EMPLOYEE_NOTIFICATIONS_PATH } from "@/features/notifications/constants";

interface EmployeeStatusLayoutProps {
  applicationRef: string;
  unreadCount?: number;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export function EmployeeStatusLayout({
  applicationRef,
  unreadCount = 0,
  sidebar,
  children,
}: EmployeeStatusLayoutProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [, startTransition] = useTransition();

  function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    startTransition(async () => {
      try {
        await employeeLogoutAction();
      } finally {
        window.location.replace("/login");
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] lg:flex-row">
      {sidebar && (
        <div className="hidden w-80 shrink-0 lg:block xl:w-96">{sidebar}</div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 shadow-sm lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo href="/application" variant="dark" className="max-w-[260px] sm:max-w-[300px]" />
            <p className="hidden font-mono text-[10px] text-[#64748B] lg:block">
              {applicationRef}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell href={EMPLOYEE_NOTIFICATIONS_PATH} unreadCount={unreadCount} />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out…" : "Sign Out"}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
