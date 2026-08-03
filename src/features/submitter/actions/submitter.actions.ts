"use server";

import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole, EmployeeStatus } from "@/types/enums";
import { connectDB } from "@/lib/db/connect";
import { Employee } from "@/lib/db/models/Employee";
import {
  createEmployeeSession,
  setEmployeeSessionCookie,
  clearEmployeeSessionCookie,
} from "@/lib/auth/employee-session";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

const EDITABLE = [
  EmployeeStatus.DRAFT,
  EmployeeStatus.SUBMITTED,
  EmployeeStatus.L1_REVIEW,
  EmployeeStatus.L1_RETURNED,
  EmployeeStatus.L2_RETURNED,
];

export async function startNewRegistrationAction(): Promise<void> {
  await requireStaffAuth(UserRole.SUBMITTER);
  await clearEmployeeSessionCookie();
  redirect("/dashboard/submitter?new=1");
}

export async function openSubmitterRegistrationAction(
  employeeId: string
): Promise<{ success: true; redirectTo: string } | { success: false; error: string }> {
  const { user } = await requireStaffAuth(UserRole.SUBMITTER);
  await connectDB();

  const employee = await Employee.findOne({
    _id: employeeId,
    submittedBy: new mongoose.Types.ObjectId(user.id),
  });

  if (!employee) {
    return { success: false, error: "Registration not found" };
  }

  if (!EDITABLE.includes(employee.status)) {
    return {
      success: false,
      error: "This registration is locked and cannot be edited",
    };
  }

  const token = await createEmployeeSession({
    employeeId: employee._id.toString(),
    applicationRef: employee.applicationRef,
    email: employee.email,
  });
  await setEmployeeSessionCookie(token);
  return { success: true, redirectTo: "/dashboard/submitter?continue=1" };
}
