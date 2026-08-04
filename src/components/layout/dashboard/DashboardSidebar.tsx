"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LucideIcon,
  LayoutDashboard,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  FileOutput,
  Users,
  FolderOpen,
  Compass,
  Shield,
  ShieldCheck,
  UserPlus,
  Headphones,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StaffRole, UserRole } from "@/types/enums";
import { getRoleLabel } from "@/lib/auth/permissions";
import { SidebarNotificationBadge } from "@/features/notifications/components/NotificationBell";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useDashboardChrome } from "@/components/layout/dashboard/DashboardChromeContext";

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
    title: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard/support", icon: LayoutDashboard },
      { label: "Registrations", href: "/dashboard/support/registrations", icon: FileOutput },
      { label: "Documents", href: "/dashboard/support/documents", icon: FolderOpen },
      { label: "Notifications", href: "/dashboard/support/notifications", icon: Bell },
    ],
  },
];

const ADMIN_NAV: NavSection[] = [
  {
    title: "Administration",
    items: [
      { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
      { label: "Users", href: "/dashboard/admin/users", icon: Users },
      {
        label: "Approved",
        href: "/dashboard/admin/registrations",
        icon: CheckCircle2,
      },
      { label: "Documents", href: "/dashboard/admin/documents", icon: FolderOpen },
      { label: "Notifications", href: "/dashboard/admin/notifications", icon: Bell },
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
    { label: "Documents", href: "/dashboard/submitter/documents", icon: FolderOpen },
    { label: "Notifications", href: "/dashboard/submitter/notifications", icon: Bell },
  ],
  [UserRole.L1]: [
    { label: "Dashboard", href: "/dashboard/l1", icon: LayoutDashboard },
    { label: "Pending", href: "/dashboard/l1/applications/pending", icon: Clock },
    { label: "Approved", href: "/dashboard/l1/applications/approved", icon: CheckCircle2 },
    { label: "All Registrations", href: "/dashboard/l1/applications/all", icon: FileOutput },
    { label: "Reversed", href: "/dashboard/l1/applications/rejected", icon: XCircle },
    { label: "Notifications", href: "/dashboard/l1/notifications", icon: Bell },
  ],
  [UserRole.L2]: [
    { label: "Dashboard", href: "/dashboard/l2", icon: LayoutDashboard },
    { label: "Pending", href: "/dashboard/l2/applications/pending", icon: Clock },
    { label: "Approved", href: "/dashboard/l2/applications/approved", icon: CheckCircle2 },
    { label: "All Registrations", href: "/dashboard/l2/applications/all", icon: FileOutput },
    { label: "Reversed", href: "/dashboard/l2/applications/rejected", icon: XCircle },
    { label: "Documents", href: "/dashboard/l2/documents", icon: FolderOpen },
    { label: "Notifications", href: "/dashboard/l2/notifications", icon: Bell },
  ],
  [UserRole.SUPPORT]: SUPPORT_NAV,
  [UserRole.ADMIN]: ADMIN_NAV,
};

const SECTIONED_ROLES = new Set<StaffRole>([UserRole.SUPPORT, UserRole.ADMIN]);

const ROLE_BADGE: Record<StaffRole, { icon: LucideIcon; className: string }> = {
  [UserRole.SUBMITTER]: {
    icon: UserPlus,
    className:
      "border-sky-400/30 bg-gradient-to-r from-sky-500/25 to-blue-600/20 text-sky-200",
  },
  [UserRole.L1]: {
    icon: Shield,
    className:
      "border-indigo-400/30 bg-gradient-to-r from-indigo-500/25 to-violet-600/20 text-indigo-200",
  },
  [UserRole.L2]: {
    icon: ShieldCheck,
    className:
      "border-amber-400/35 bg-gradient-to-r from-amber-500/30 to-[#D4AF37]/20 text-amber-100",
  },
  [UserRole.SUPPORT]: {
    icon: Headphones,
    className:
      "border-teal-400/30 bg-gradient-to-r from-teal-500/25 to-cyan-600/20 text-teal-100",
  },
  [UserRole.ADMIN]: {
    icon: Crown,
    className:
      "border-violet-400/30 bg-gradient-to-r from-violet-500/25 to-fuchsia-600/15 text-violet-100",
  },
};

interface DashboardSidebarProps {
  role: StaffRole;
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
  if (
    hrefPath.endsWith("/registrations") &&
    pathname.includes("/registrations/reversed")
  ) {
    return false;
  }
  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
}

export function DashboardSidebar({ role, unreadCount = 0 }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useDashboardChrome();
  const navConfig = NAV_ITEMS[role];
  const sections: NavSection[] = SECTIONED_ROLES.has(role)
    ? (navConfig as NavSection[])
    : [{ title: "Navigation", items: navConfig as NavItem[] }];

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

  const roleBadge = ROLE_BADGE[role];
  const RoleIcon = roleBadge.icon;

  function handleNavClick() {
    // Close mobile drawer after navigation
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-[#0B1F3A]/45 backdrop-blur-[1px] lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "relative z-50 flex h-full w-[17rem] shrink-0 flex-col overflow-hidden text-white",
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:shadow-2xl max-lg:transition-transform max-lg:duration-300",
          collapsed ? "max-lg:-translate-x-full" : "max-lg:translate-x-0",
          "lg:static lg:translate-x-0"
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050D18] via-[#0A1A32] to-[#0E2748]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_20%_-10%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(ellipse_70%_40%_at_90%_5%,rgba(212,175,55,0.12),transparent_50%)]" />

        {/* Branding — logo only (no duplicate portal titles) */}
        <div className="relative shrink-0 border-b border-white/[0.08] px-3.5 pb-4 pt-4">
          <Link
            href={dashboardHome}
            onClick={handleNavClick}
            className="block rounded-xl bg-white/[0.04] px-2.5 py-2.5 ring-1 ring-inset ring-white/[0.08] transition-colors hover:bg-white/[0.07]"
            aria-label="Rakshak Enrollment Portal home"
          >
            <BrandLogo
              href={null}
              variant="sidebar"
              priority
              className="max-w-[240px]"
            />
          </Link>

          <div className="mt-3.5 px-0.5">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                roleBadge.className
              )}
            >
              <RoleIcon className="h-3 w-3" />
              {getRoleLabel(role)}
            </span>
          </div>
        </div>

        <nav className="relative min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-3 py-4 scrollbar-none">
          {sections.map((section, idx) => (
            <div key={section.title ?? idx}>
              {section.title && (
                <div className="mb-2.5 flex items-center gap-2 px-2.5">
                  <Compass className="h-3 w-3 text-white/35" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    {section.title}
                  </p>
                </div>
              )}
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const isActive = isNavActive(pathname, item.href, role);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch
                      onClick={handleNavClick}
                      className={cn(
                        "group relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-all duration-200",
                        isActive
                          ? "bg-white/[0.14] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                          : "text-white/70 hover:bg-white/[0.08] hover:text-white"
                      )}
                    >
                      {isActive && (
                        <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-gradient-to-b from-accent to-[#F5D76E]" />
                      )}
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition duration-200",
                          isActive
                            ? "bg-accent/20 text-accent"
                            : "bg-white/5 text-white/75 group-hover:bg-white/10 group-hover:text-white"
                        )}
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                      </span>
                      <span className="truncate font-medium tracking-tight">
                        {item.label}
                      </span>
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
      </aside>
    </>
  );
}
