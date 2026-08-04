"use client";

import { DashboardChromeProvider } from "@/components/layout/dashboard/DashboardChromeContext";
import { DashboardSidebar } from "@/components/layout/dashboard/DashboardSidebar";
import { ProfileMenu } from "@/components/layout/dashboard/ProfileMenu";
import { DashboardLiveRefresh } from "@/components/dashboard/DashboardLiveRefresh";
import { DashboardBreadcrumbs } from "@/components/dashboard/DashboardBreadcrumbs";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { getRoleLabel } from "@/lib/auth/permissions";
import { StaffRole } from "@/types/enums";
import { PanelLeft } from "lucide-react";
import { useDashboardChrome } from "@/components/layout/dashboard/DashboardChromeContext";

interface DashboardFrameProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: StaffRole;
  };
  unreadCount: number;
  notificationsHref: string;
  homeHref: string;
  profileHref: string;
}

function DashboardHeader({
  user,
  unreadCount,
  notificationsHref,
  homeHref,
  profileHref,
}: Omit<DashboardFrameProps, "children">) {
  const { collapsed, setCollapsed } = useDashboardChrome();

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#475569] transition hover:border-sky-200 hover:bg-[#EFF6FF] hover:text-[#1D4ED8] lg:hidden"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <BrandLogo
            href={homeHref}
            variant="dark"
            className="max-w-[160px] sm:max-w-[200px] lg:hidden"
          />
          <div className="hidden min-w-0 lg:block">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-heading text-base font-semibold text-primary">
                Employee Onboarding
              </h1>
              <span className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">
                {getRoleLabel(user.role)}
              </span>
            </div>
            <DashboardBreadcrumbs homeHref={homeHref} className="mt-0.5" />
          </div>
          <DashboardLiveRefresh role={user.role} />
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <NotificationBell href={notificationsHref} unreadCount={unreadCount} />
          <ProfileMenu
            userName={user.name}
            userEmail={user.email}
            role={user.role}
            profileHref={profileHref}
          />
        </div>
      </div>
      <div className="border-t border-[#F1F5F9] px-4 py-2 lg:hidden">
        <DashboardBreadcrumbs homeHref={homeHref} />
      </div>
    </header>
  );
}

export function DashboardFrame(props: DashboardFrameProps) {
  const { children, user, unreadCount, homeHref, profileHref, ...headerProps } =
    props;

  return (
    <DashboardChromeProvider>
      <div className="dashboard-shell-bg flex h-dvh overflow-hidden">
        <DashboardSidebar role={user.role} unreadCount={unreadCount} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-l border-[#E2E8F0]/70 bg-[#F7F9FC]">
          <DashboardHeader
            user={user}
            unreadCount={unreadCount}
            homeHref={homeHref}
            profileHref={profileHref}
            {...headerProps}
          />
          <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </DashboardChromeProvider>
  );
}
