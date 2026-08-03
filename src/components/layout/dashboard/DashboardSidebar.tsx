"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  LucideIcon,
  LayoutDashboard,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  User,
  FileOutput,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StaffRole, UserRole } from "@/types/enums";
import { staffLogoutAction } from "@/features/auth/actions/auth.actions";
import { getRoleLabel } from "@/lib/auth/permissions";
import { SidebarNotificationBadge } from "@/features/notifications/components/NotificationBell";
import { BrandLogo } from "@/components/brand/BrandLogo";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const SUPPORT_NAV: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard/support", icon: LayoutDashboard },
      { label: "Registrations", href: "/dashboard/support/registrations", icon: FileOutput },
      { label: "Notifications", href: "/dashboard/support/notifications", icon: Bell },
      { label: "Profile", href: "/dashboard/support/profile", icon: User },
    ],
  },
];

const ADMIN_NAV: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
      { label: "Users", href: "/dashboard/admin/users", icon: Users },
      {
        label: "Approved",
        href: "/dashboard/admin/registrations",
        icon: CheckCircle,
      },
      { label: "Notifications", href: "/dashboard/admin/notifications", icon: Bell },
      { label: "Profile", href: "/dashboard/admin/profile", icon: User },
    ],
  },
];

const NAV_ITEMS: Record<StaffRole, NavItem[] | NavSection[]> = {
  [UserRole.SUBMITTER]: [
    { label: "New Registration", href: "/dashboard/submitter?new=1", icon: LayoutDashboard },
    {
      label: "All Registrations",
      href: "/dashboard/submitter/registrations",
      icon: FileOutput,
    },
    {
      label: "Reversed",
      href: "/dashboard/submitter/registrations/reversed",
      icon: XCircle,
    },
    { label: "Notifications", href: "/dashboard/submitter/notifications", icon: Bell },
    { label: "Profile", href: "/dashboard/submitter/profile", icon: User },
  ],
  [UserRole.L1]: [
    { label: "Dashboard", href: "/dashboard/l1", icon: LayoutDashboard },
    { label: "Pending", href: "/dashboard/l1/applications/pending", icon: Clock },
    { label: "Approved", href: "/dashboard/l1/applications/approved", icon: CheckCircle },
    { label: "All Registrations", href: "/dashboard/l1/applications/all", icon: FileOutput },
    { label: "Reversed", href: "/dashboard/l1/applications/rejected", icon: XCircle },
    { label: "Notifications", href: "/dashboard/l1/notifications", icon: Bell },
    { label: "Profile", href: "/dashboard/l1/profile", icon: User },
  ],
  [UserRole.L2]: [
    { label: "Dashboard", href: "/dashboard/l2", icon: LayoutDashboard },
    { label: "Pending", href: "/dashboard/l2/applications/pending", icon: Clock },
    { label: "Approved", href: "/dashboard/l2/applications/approved", icon: CheckCircle },
    { label: "All Registrations", href: "/dashboard/l2/applications/all", icon: FileOutput },
    { label: "Reversed", href: "/dashboard/l2/applications/rejected", icon: XCircle },
    { label: "Notifications", href: "/dashboard/l2/notifications", icon: Bell },
    { label: "Profile", href: "/dashboard/l2/profile", icon: User },
  ],
  [UserRole.SUPPORT]: SUPPORT_NAV,
  [UserRole.ADMIN]: ADMIN_NAV,
};

const SECTIONED_ROLES = new Set<StaffRole>([UserRole.SUPPORT, UserRole.ADMIN]);

interface DashboardSidebarProps {
  role: StaffRole;
  userName: string;
  unreadCount?: number;
}

function isNavActive(pathname: string, href: string, role: StaffRole): boolean {
  const hrefPath = href.split("?")[0];
  const dashboardRoots: Record<StaffRole, string> = {
    [UserRole.SUBMITTER]: "/dashboard/submitter",
    [UserRole.L1]: "/dashboard/l1",
    [UserRole.L2]: "/dashboard/l2",
    [UserRole.SUPPORT]: "/dashboard/support",
    [UserRole.ADMIN]: "/dashboard/admin",
  };
  const root = dashboardRoots[role];
  if (hrefPath === root) return pathname === root;
  // Avoid marking "All Registrations" active on the Reversed page
  if (
    hrefPath.endsWith("/registrations") &&
    pathname.includes("/registrations/reversed")
  ) {
    return false;
  }
  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
}

export function DashboardSidebar({ role, userName, unreadCount = 0 }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [, startTransition] = useTransition();
  const navConfig = NAV_ITEMS[role];
  const sections: NavSection[] = SECTIONED_ROLES.has(role)
    ? (navConfig as NavSection[])
    : [{ items: navConfig as NavItem[] }];

  const dashboardHome =
    role === UserRole.SUBMITTER
      ? "/dashboard/submitter"
      : role === UserRole.L1
        ? "/dashboard/l1"
        : role === UserRole.L2
          ? "/dashboard/l2"
          : role === UserRole.ADMIN
            ? "/dashboard/admin"
            : "/dashboard/support";

  function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    startTransition(async () => {
      try {
        await staffLogoutAction();
      } finally {
        window.location.replace("/staff/login");
      }
    });
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-hidden bg-gradient-to-b from-[#0B1F3A] via-[#12325C] to-[#0F2748] text-white shadow-xl">
      <div className="shrink-0 border-b border-white/10 px-4 py-5 sm:px-5">
        <BrandLogo href={dashboardHome} variant="sidebar" priority />
      </div>

      <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4">
        {sections.map((section, idx) => (
          <div key={section.title ?? idx}>
            {section.title && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = isNavActive(pathname, item.href, role);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-white/20 to-white/10 text-accent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                        : "text-white/70 hover:translate-x-0.5 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition duration-200",
                        isActive ? "text-accent" : "group-hover:scale-110"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                    {item.label === "Notifications" && (
                      <SidebarNotificationBadge unreadCount={unreadCount} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="mb-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm">
          <p className="truncate text-sm font-medium">{userName}</p>
          <p className="mt-0.5 text-xs text-white/55">{getRoleLabel(role)}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition hover:bg-red-500/15 hover:text-red-100 disabled:opacity-60"
        >
          <LogOut className="h-5 w-5" />
          {isSigningOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
