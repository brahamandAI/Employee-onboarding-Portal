import { connectDB } from "@/lib/db/connect";
import { Employee } from "@/lib/db/models/Employee";
import { EmployeeStatus, StaffRole, UserRole } from "@/types/enums";
import { getStaffUnreadCount } from "@/lib/services/notification.service";
import mongoose from "mongoose";

export interface DashboardLiveSnapshot {
  fingerprint: string;
  pendingCount: number;
  unreadCount: number;
  role: StaffRole;
}

/**
 * Cheap change detector for the dashboard poller.
 * Full queue stats are loaded by each page — this endpoint only needs a
 * watermark so router.refresh() can run when something actually changed.
 */
export async function getDashboardLiveSnapshot(
  role: StaffRole,
  userId: string
): Promise<DashboardLiveSnapshot> {
  await connectDB();

  const activityFilter =
    role === UserRole.SUBMITTER
      ? {
          submittedBy: new mongoose.Types.ObjectId(userId),
          status: { $ne: EmployeeStatus.DRAFT },
        }
      : { status: { $ne: EmployeeStatus.DRAFT } };

  const [unreadCount, latest] = await Promise.all([
    getStaffUnreadCount(userId),
    Employee.findOne(activityFilter)
      .sort({ updatedAt: -1 })
      .select("updatedAt")
      .lean(),
  ]);

  const latestActivity = latest?.updatedAt
    ? new Date(latest.updatedAt).getTime()
    : 0;

  return {
    role,
    pendingCount: unreadCount,
    unreadCount,
    fingerprint: `${role}:${unreadCount}:${latestActivity}`,
  };
}
