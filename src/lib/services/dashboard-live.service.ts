import { connectDB } from "@/lib/db/connect";
import { Employee } from "@/lib/db/models/Employee";
import { StaffRole, UserRole } from "@/types/enums";
import { getL1Stats } from "@/lib/services/l1.service";
import { getL2Stats } from "@/lib/services/l2.service";
import { getSupportStats } from "@/lib/services/support.service";
import { getStaffUnreadCount } from "@/lib/services/notification.service";
import {
  getSubmitterStats,
  getAdminRegistrationStats,
} from "@/lib/services/submitter.service";
import {
  L1_PENDING_FILTER,
  L2_PENDING_FILTER,
  SUPPORT_PENDING_FILTER,
  ADMIN_REGISTRATIONS_FILTER,
} from "@/lib/services/approval-queue";
import mongoose from "mongoose";

export interface DashboardLiveSnapshot {
  fingerprint: string;
  pendingCount: number;
  unreadCount: number;
  role: StaffRole;
}

async function getLatestQueueTimestamp(
  role: StaffRole,
  userId: string
): Promise<number> {
  await connectDB();

  let filter: Record<string, unknown>;

  if (role === UserRole.L1) {
    filter = L1_PENDING_FILTER;
  } else if (role === UserRole.L2) {
    filter = L2_PENDING_FILTER;
  } else if (role === UserRole.SUBMITTER) {
    filter = { submittedBy: new mongoose.Types.ObjectId(userId) };
  } else if (role === UserRole.ADMIN) {
    filter = ADMIN_REGISTRATIONS_FILTER;
  } else {
    filter = SUPPORT_PENDING_FILTER;
  }

  const latest = await Employee.findOne(filter)
    .sort({ updatedAt: -1 })
    .select("updatedAt")
    .lean();

  return latest?.updatedAt ? new Date(latest.updatedAt).getTime() : 0;
}

export async function getDashboardLiveSnapshot(
  role: StaffRole,
  userId: string
): Promise<DashboardLiveSnapshot> {
  const [unreadCount, latestActivity] = await Promise.all([
    getStaffUnreadCount(userId),
    getLatestQueueTimestamp(role, userId),
  ]);

  if (role === UserRole.SUBMITTER) {
    const stats = await getSubmitterStats(userId);
    return {
      role,
      pendingCount: stats.pendingL1 + stats.pendingL2,
      unreadCount,
      fingerprint: `submitter:${stats.total}:${stats.pendingL1}:${stats.pendingL2}:${stats.approved}:${unreadCount}:${latestActivity}`,
    };
  }

  if (role === UserRole.L1) {
    const stats = await getL1Stats(userId);
    return {
      role,
      pendingCount: stats.pending,
      unreadCount,
      fingerprint: `l1:${stats.pending}:${stats.approved}:${stats.rejected}:${stats.returnedToday}:${unreadCount}:${latestActivity}`,
    };
  }

  if (role === UserRole.L2) {
    const stats = await getL2Stats(userId);
    return {
      role,
      pendingCount: stats.pending,
      unreadCount,
      fingerprint: `l2:${stats.pending}:${stats.approved}:${stats.rejected}:${stats.forwarded}:${unreadCount}:${latestActivity}`,
    };
  }

  if (role === UserRole.ADMIN) {
    const stats = await getAdminRegistrationStats();
    return {
      role,
      pendingCount: stats.completed,
      unreadCount,
      fingerprint: `admin:${stats.completed}:${stats.pendingL1}:${stats.pendingL2}:${unreadCount}:${latestActivity}`,
    };
  }

  const stats = await getSupportStats();
  return {
    role,
    pendingCount: stats.pending,
    unreadCount,
    fingerprint: `support:${stats.pending}:${stats.completed}:${stats.generatedToday}:${unreadCount}:${latestActivity}`,
  };
}
