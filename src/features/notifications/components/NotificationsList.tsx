"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NotificationViewModel,
  NOTIFICATION_TYPE_CONFIG,
} from "@/features/notifications/constants";
import { cn } from "@/lib/utils";

interface NotificationsListProps {
  notifications: NotificationViewModel[];
  onMarkRead: (id: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
  emptyMessage?: string;
}

export function NotificationsList({
  notifications,
  onMarkRead,
  onMarkAllRead,
  emptyMessage = "No notifications yet.",
}: NotificationsListProps) {
  const [pending, startTransition] = useTransition();

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center">
        <Bell className="mx-auto h-10 w-10 text-[#64748B]/40" />
        <p className="mt-3 text-[#64748B]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#64748B]">
          {unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
            : "All caught up"}
        </p>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            isLoading={pending}
            onClick={() => startTransition(() => onMarkAllRead())}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((n) => {
          const typeConfig = NOTIFICATION_TYPE_CONFIG[n.type];
          return (
            <div
              key={n._id}
              className={cn(
                "rounded-xl border bg-white p-4",
                n.readAt ? "border-[#E2E8F0]" : "border-primary/20 bg-primary/5"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        typeConfig?.badgeClass ?? "bg-gray-100 text-gray-700"
                      )}
                    >
                      {typeConfig?.label ?? n.type}
                    </span>
                    {!n.readAt && (
                      <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                    )}
                  </div>
                  <p className="mt-2 font-medium text-primary">{n.title}</p>
                  <p className="mt-1 text-sm text-[#64748B]">{n.body}</p>
                  <time className="mt-2 block text-xs text-[#64748B]">
                    {new Date(n.createdAt).toLocaleString("en-IN")}
                  </time>
                  {n.linkUrl && (
                    <Link
                      href={n.linkUrl}
                      className="mt-2 inline-block text-sm text-primary underline"
                    >
                      View details
                    </Link>
                  )}
                </div>
                {!n.readAt && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    onClick={() =>
                      startTransition(() => onMarkRead(n._id))
                    }
                  >
                    Mark read
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
