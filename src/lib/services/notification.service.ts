import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Notification } from "@/lib/db/models/Notification";
import { User } from "@/lib/db/models/User";
import { UserRole } from "@/types/enums";
import {
  NotificationType,
  NotificationViewModel,
  NotificationRecipientType,
} from "@/features/notifications/constants";

export interface CreateNotificationParams {
  recipientType: NotificationRecipientType;
  recipientId: string;
  type: NotificationType;
  title: string;
  body: string;
  employeeId?: string;
  applicationRef?: string;
  linkUrl?: string;
}

function mapNotification(doc: Record<string, unknown>): NotificationViewModel {
  return {
    _id: String(doc._id),
    type: doc.type as NotificationType,
    title: String(doc.title),
    body: String(doc.body),
    readAt: doc.readAt ? new Date(doc.readAt as Date).toISOString() : undefined,
    createdAt: new Date(doc.createdAt as Date).toISOString(),
    linkUrl: doc.linkUrl as string | undefined,
    applicationRef: doc.applicationRef as string | undefined,
    employeeId: doc.employeeId ? String(doc.employeeId) : undefined,
  };
}

export async function createNotification(
  params: CreateNotificationParams
): Promise<void> {
  await connectDB();
  await Notification.create({
    recipientType: params.recipientType,
    recipientId: new mongoose.Types.ObjectId(params.recipientId),
    type: params.type,
    title: params.title,
    body: params.body,
    employeeId: params.employeeId
      ? new mongoose.Types.ObjectId(params.employeeId)
      : undefined,
    applicationRef: params.applicationRef,
    linkUrl: params.linkUrl,
  });
}

export async function notifyStaffByRole(
  role: UserRole.L1 | UserRole.L2 | UserRole.SUPPORT,
  params: Omit<CreateNotificationParams, "recipientType" | "recipientId"> & {
    recipientId?: string;
  }
): Promise<void> {
  if (params.recipientId) {
    await createNotification({
      ...params,
      recipientType: "STAFF",
      recipientId: params.recipientId,
    });
    return;
  }

  await connectDB();
  const users = await User.find({ role, isActive: true }).lean();
  for (const user of users) {
    await createNotification({
      ...params,
      recipientType: "STAFF",
      recipientId: String(user._id),
    });
  }
}

export async function getNotificationHistory(
  recipientType: NotificationRecipientType,
  recipientId: string,
  limit = 50
): Promise<NotificationViewModel[]> {
  await connectDB();
  const items = await Notification.find({ recipientType, recipientId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return items.map((n) => mapNotification(n as Record<string, unknown>));
}

/** @deprecated Use getNotificationHistory */
export async function getNotificationsForUser(userId: string, limit = 20) {
  await connectDB();
  return Notification.find({
    $or: [
      { recipientType: "STAFF", recipientId: userId },
      { recipientId: userId, recipientType: { $exists: false } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getUnreadCount(
  recipientType: NotificationRecipientType,
  recipientId: string
): Promise<number> {
  await connectDB();
  return Notification.countDocuments({
    recipientType,
    recipientId,
    readAt: { $exists: false },
  });
}

/** Staff unread — includes legacy notifications without recipientType */
export async function getStaffUnreadCount(userId: string): Promise<number> {
  await connectDB();
  return Notification.countDocuments({
    readAt: { $exists: false },
    $or: [
      { recipientType: "STAFF", recipientId: userId },
      { recipientId: userId, recipientType: { $exists: false } },
    ],
  });
}

export async function markNotificationRead(
  notificationId: string,
  recipientType: NotificationRecipientType,
  recipientId: string
): Promise<void> {
  await connectDB();
  await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipientType,
      recipientId,
    },
    { readAt: new Date() }
  );
}

export async function markStaffNotificationRead(
  notificationId: string,
  userId: string
): Promise<void> {
  await connectDB();
  await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      readAt: { $exists: false },
      $or: [
        { recipientType: "STAFF", recipientId: userId },
        { recipientId: userId, recipientType: { $exists: false } },
      ],
    },
    { readAt: new Date() }
  );
}

export async function markAllNotificationsRead(
  recipientType: NotificationRecipientType,
  recipientId: string
): Promise<void> {
  await connectDB();
  await Notification.updateMany(
    { recipientType, recipientId, readAt: { $exists: false } },
    { readAt: new Date() }
  );
}

export async function markAllStaffNotificationsRead(userId: string): Promise<void> {
  await connectDB();
  await Notification.updateMany(
    {
      readAt: { $exists: false },
      $or: [
        { recipientType: "STAFF", recipientId: userId },
        { recipientId: userId, recipientType: { $exists: false } },
      ],
    },
    { readAt: new Date() }
  );
}

export async function getStaffNotificationHistory(
  userId: string,
  limit = 50
): Promise<NotificationViewModel[]> {
  await connectDB();
  const items = await Notification.find({
    $or: [
      { recipientType: "STAFF", recipientId: userId },
      { recipientId: userId, recipientType: { $exists: false } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return items.map((n) => mapNotification(n as Record<string, unknown>));
}

export async function getEmployeeNotificationHistory(
  employeeId: string,
  limit = 50
): Promise<NotificationViewModel[]> {
  return getNotificationHistory("EMPLOYEE", employeeId, limit);
}

export async function getEmployeeUnreadCount(employeeId: string): Promise<number> {
  return getUnreadCount("EMPLOYEE", employeeId);
}
