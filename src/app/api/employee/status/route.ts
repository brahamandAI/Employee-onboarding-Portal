import { NextResponse } from "next/server";
import { getEmployeeSession } from "@/lib/auth/employee-session";
import { getApplicationStatus } from "@/lib/services/application-status.service";
import { getEmployeeNotificationHistory } from "@/lib/services/notification.service";
import {
  getApprovalStageLabel,
  getRegistrationStatusLabel,
} from "@/features/application-status/constants";

export async function GET() {
  const session = await getEmployeeSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [status, notifications] = await Promise.all([
    getApplicationStatus(session.employeeId),
    getEmployeeNotificationHistory(session.employeeId, 8),
  ]);

  if (!status) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...status,
    statusLabel: getRegistrationStatusLabel(status.status),
    approvalStage: getApprovalStageLabel(status.status),
    notifications,
    updatedAt: new Date().toISOString(),
  });
}
