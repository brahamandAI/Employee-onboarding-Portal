"use client";

import {
  markEmployeeNotificationReadAction,
  markAllEmployeeNotificationsReadAction,
} from "@/features/notifications/actions/notifications.actions";
import { NotificationsList } from "@/features/notifications/components/NotificationsList";
import { NotificationViewModel } from "@/features/notifications/constants";

interface EmployeeNotificationsPanelProps {
  notifications: NotificationViewModel[];
}

export function EmployeeNotificationsPanel({
  notifications,
}: EmployeeNotificationsPanelProps) {
  return (
    <NotificationsList
      notifications={notifications}
      onMarkRead={markEmployeeNotificationReadAction}
      onMarkAllRead={markAllEmployeeNotificationsReadAction}
    />
  );
}
