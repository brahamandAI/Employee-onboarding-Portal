import { requireStaffAuth } from "@/lib/auth/guards";
import { DashboardSidebar } from "@/components/layout/dashboard/DashboardSidebar";
import { DashboardLiveRefresh } from "@/components/dashboard/DashboardLiveRefresh";
import { getStaffUnreadCount } from "@/lib/services/notification.service";
import { STAFF_NOTIFICATIONS_PATH } from "@/features/notifications/constants";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { UserRole } from "@/types/enums";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { getRoleLabel } from "@/lib/auth/permissions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireStaffAuth();
  const unreadCount = await getStaffUnreadCount(user.id);
  const notificationsHref =
    STAFF_NOTIFICATIONS_PATH[user.role] ?? "/dashboard/admin/notifications";

  const homeHref =
    user.role === UserRole.SUBMITTER
      ? "/dashboard/submitter"
      : user.role === UserRole.L1
        ? "/dashboard/l1"
        : user.role === UserRole.L2
          ? "/dashboard/l2"
          : user.role === UserRole.ADMIN
            ? "/dashboard/admin"
            : "/dashboard/support";

  return (
    <div className="dashboard-shell-bg flex h-dvh overflow-hidden">
      <DashboardSidebar
        role={user.role}
        userName={user.name}
        unreadCount={unreadCount}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-[#E2E8F0]/80 bg-white/85 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <BrandLogo
              href={homeHref}
              variant="dark"
              className="max-w-[200px] sm:max-w-[240px] lg:hidden"
            />
            <div className="min-w-0">
              <h1 className="truncate font-heading text-base font-semibold text-primary sm:text-lg">
                Employee Onboarding
              </h1>
              <p className="hidden truncate text-xs text-[#64748B] sm:block">
                {getRoleLabel(user.role)} · {user.name}
              </p>
            </div>
            <DashboardLiveRefresh role={user.role} />
          </div>
          <NotificationBell href={notificationsHref} unreadCount={unreadCount} />
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
