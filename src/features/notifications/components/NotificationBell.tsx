import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  href: string;
  unreadCount: number;
  className?: string;
}

export function NotificationBell({
  href,
  unreadCount,
  className,
}: NotificationBellProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-md text-primary transition-colors hover:bg-muted",
        className
      )}
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}

interface SidebarNotificationBadgeProps {
  unreadCount: number;
}

export function SidebarNotificationBadge({
  unreadCount,
}: SidebarNotificationBadgeProps) {
  if (unreadCount <= 0) return null;
  return (
    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-primary">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  );
}
