import { EmployeeStatus, UserRole } from "@/types/enums";
import { NotificationType } from "@/features/notifications/constants";
import {
  createNotification,
  notifyStaffByRole,
} from "@/lib/services/notification.service";

interface EmployeeNotifyContext {
  _id: string;
  applicationRef: string;
  employeeId?: string;
  personalDetails?: Record<string, unknown>;
}

function fullName(employee: EmployeeNotifyContext): string {
  const personal = employee.personalDetails as { fullName?: string } | undefined;
  return personal?.fullName ?? "Employee";
}

export async function dispatchApplicationSubmitted(
  employee: EmployeeNotifyContext,
  assignedL1Id?: string
): Promise<void> {
  const name = fullName(employee);

  await createNotification({
    recipientType: "EMPLOYEE",
    recipientId: employee._id,
    type: NotificationType.APPLICATION_SUBMITTED,
    title: "Application Submitted",
    body: `Your application ${employee.applicationRef} has been submitted successfully and is under review.`,
    employeeId: employee._id,
    applicationRef: employee.applicationRef,
    linkUrl: "/application",
  });

  if (assignedL1Id) {
    await createNotification({
      recipientType: "STAFF",
      recipientId: assignedL1Id,
      type: NotificationType.APPLICATION_SUBMITTED,
      title: "Application Submitted",
      body: `${name} (${employee.applicationRef}) submitted an application for L1 review.`,
      employeeId: employee._id,
      applicationRef: employee.applicationRef,
      linkUrl: `/dashboard/l1/applications/${employee._id}`,
    });
  } else {
    await notifyStaffByRole(UserRole.L1, {
      type: NotificationType.APPLICATION_SUBMITTED,
      title: "Application Submitted",
      body: `${name} (${employee.applicationRef}) submitted an application for L1 review.`,
      employeeId: employee._id,
      applicationRef: employee.applicationRef,
      linkUrl: `/dashboard/l1/applications/${employee._id}`,
    });
  }
}

export async function dispatchL1Approved(employee: EmployeeNotifyContext): Promise<void> {
  const name = fullName(employee);
  const idLine = employee.employeeId
    ? ` Your employee number is ${employee.employeeId}.`
    : "";

  await createNotification({
    recipientType: "EMPLOYEE",
    recipientId: employee._id,
    type: NotificationType.L1_APPROVED,
    title: "L1 Approved — Employee ID Assigned",
    body: `Your application ${employee.applicationRef} passed L1 review.${idLine} Awaiting final L2 approval.`,
    employeeId: employee._id,
    applicationRef: employee.applicationRef,
    linkUrl: "/application",
  });

  await notifyStaffByRole(UserRole.L2, {
    type: NotificationType.L1_APPROVED,
    title: "L1 Approved — Ready for L2",
    body: `${name} (${employee.applicationRef}${employee.employeeId ? `, ${employee.employeeId}` : ""}) awaits your L2 approval.`,
    employeeId: employee._id,
    applicationRef: employee.applicationRef,
    linkUrl: `/dashboard/l2/applications/${employee._id}`,
  });
}

export async function dispatchL2Approved(employee: EmployeeNotifyContext): Promise<void> {
  await createNotification({
    recipientType: "EMPLOYEE",
    recipientId: employee._id,
    type: NotificationType.L2_APPROVED,
    title: "L2 Approved",
    body: `Congratulations! Your application ${employee.applicationRef} has been fully approved.`,
    employeeId: employee._id,
    applicationRef: employee.applicationRef,
    linkUrl: "/application",
  });
}

export async function dispatchCorrectionRequired(
  employee: EmployeeNotifyContext,
  level: "L1" | "L2",
  comment?: string
): Promise<void> {
  const note = comment ? ` Notes: ${comment}` : "";
  await createNotification({
    recipientType: "EMPLOYEE",
    recipientId: employee._id,
    type: NotificationType.CORRECTION_REQUIRED,
    title: "Correction Required",
    body: `Your application ${employee.applicationRef} requires corrections after ${level} review.${note}`,
    employeeId: employee._id,
    applicationRef: employee.applicationRef,
    linkUrl: `/onboarding/${employee.applicationRef}`,
  });
}

export async function dispatchRejected(
  employee: EmployeeNotifyContext,
  level: "L1" | "L2",
  comment?: string
): Promise<void> {
  const note = comment ? ` Reason: ${comment}` : "";
  await createNotification({
    recipientType: "EMPLOYEE",
    recipientId: employee._id,
    type: NotificationType.REJECTED,
    title: "Application Rejected",
    body: `Your application ${employee.applicationRef} was rejected during ${level} review.${note}`,
    employeeId: employee._id,
    applicationRef: employee.applicationRef,
    linkUrl: "/application",
  });
}

export async function dispatchIdCardGenerated(
  employee: EmployeeNotifyContext
): Promise<void> {
  const idCode = employee.employeeId ?? "your employee ID";
  await createNotification({
    recipientType: "EMPLOYEE",
    recipientId: employee._id,
    type: NotificationType.ID_CARD_GENERATED,
    title: "ID Card Generated",
    body: `Your employee ID card (${idCode}) is ready. Download it from your application portal.`,
    employeeId: employee._id,
    applicationRef: employee.applicationRef,
    linkUrl: "/application",
  });
}

export async function dispatchForwardedToSupport(
  employee: EmployeeNotifyContext
): Promise<void> {
  const name = fullName(employee);
  await notifyStaffByRole(UserRole.SUPPORT, {
    type: NotificationType.FORWARDED_TO_SUPPORT,
    title: "Application Forwarded",
    body: `${name} (${employee.applicationRef}) is ready for ID card generation.`,
    employeeId: employee._id,
    applicationRef: employee.applicationRef,
    linkUrl: `/dashboard/support/id-cards/generate/${employee._id}`,
  });
}

export function employeeNotifyContext(employee: {
  _id: { toString(): string } | string;
  applicationRef: string;
  employeeId?: string;
  personalDetails?: Record<string, unknown>;
}): EmployeeNotifyContext {
  return {
    _id: String(employee._id),
    applicationRef: employee.applicationRef,
    employeeId: employee.employeeId,
    personalDetails: employee.personalDetails,
  };
}
