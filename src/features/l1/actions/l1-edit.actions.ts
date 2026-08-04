"use server";

import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole, EmployeeStatus } from "@/types/enums";
import { connectDB } from "@/lib/db/connect";
import { Employee } from "@/lib/db/models/Employee";
import {
  createEmployeeSession,
  setEmployeeSessionCookie,
} from "@/lib/auth/employee-session";
import { ApprovalError } from "@/lib/services/approval.service";

export async function openL1EmployeeEditSession(
  employeeId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await requireStaffAuth(UserRole.L1);
    await connectDB();
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return { success: false, error: "Application not found" };
    }

    const editable = [
      EmployeeStatus.SUBMITTED,
      EmployeeStatus.L1_REVIEW,
      EmployeeStatus.L1_RETURNED,
      EmployeeStatus.L2_RETURNED,
    ];
    if (!editable.includes(employee.status)) {
      return { success: false, error: "This application cannot be edited now" };
    }

    const token = await createEmployeeSession({
      employeeId: employee._id.toString(),
      applicationRef: employee.applicationRef,
      email: employee.email,
    });
    await setEmployeeSessionCookie(token);
    return { success: true };
  } catch (error) {
    if (error instanceof ApprovalError) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to open edit session",
    };
  }
}
