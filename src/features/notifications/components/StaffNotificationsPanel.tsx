"use client";

import {
  markStaffNotificationReadAction,
  markAllStaffNotificationsReadAction,
} from "@/features/notifications/actions/notifications.actions";
import { NotificationsList } from "@/features/notifications/components/NotificationsList";
import { NotificationViewModel } from "@/features/notifications/constants";

interface StaffNotificationsPanelProps {
  notifications: NotificationViewModel[];
}

export function StaffNotificationsPanel({
  notifications,
}: StaffNotificationsPanelProps) {
  return (
    <NotificationsList
      notifications={notifications}
      onMarkRead={markStaffNotificationReadAction}
      onMarkAllRead={markAllStaffNotificationsReadAction}
    />
  );
}
