import { connectDB } from "@/lib/db/connect";
import { Employee } from "@/lib/db/models/Employee";
import { IdCard } from "@/lib/db/models/IdCard";
import { EmployeeStatus } from "@/types/enums";
import {
  ApplicationStatusData,
  buildTimeline,
  resolveDisplayStatus,
  DISPLAY_STATUS_CONFIG,
} from "@/features/application-status/constants";

export async function getApplicationStatus(
  employeeId: string
): Promise<ApplicationStatusData | null> {
  await connectDB();

  const employee = await Employee.findById(employeeId);
  if (!employee) return null;

  const personalDetails = employee.personalDetails as {
    fullName?: string;
    postAppliedFor?: string;
  } | undefined;

  const idCard = await IdCard.findOne({
    employeeId: employee._id,
    status: "ACTIVE",
  }).sort({ generatedAt: -1 });

  const editableStatuses = [
    EmployeeStatus.DRAFT,
    EmployeeStatus.L1_RETURNED,
    EmployeeStatus.L2_RETURNED,
  ];

  const displayStatus = resolveDisplayStatus(employee.status);
  const config = DISPLAY_STATUS_CONFIG[displayStatus];

  const rejectionReason =
    employee.status === EmployeeStatus.REJECTED
      ? employee.rejectionReason
      : undefined;

  return {
    applicationRef: employee.applicationRef,
    fullName: personalDetails?.fullName ?? "Applicant",
    email: employee.email,
    phone: employee.phone,
    postAppliedFor: personalDetails?.postAppliedFor,
    status: employee.status,
    displayStatus,
    displayLabel: config.label,
    displayDescription: config.description,
    employeeId: employee.employeeId,
    submittedAt: employee.submittedAt?.toISOString(),
    correctionNotes: employee.correctionNotes,
    rejectionReason,
    timeline: buildTimeline(employee.status, {
      submittedAt: employee.submittedAt,
      createdAt: employee.createdAt,
      idCardGeneratedAt: idCard?.generatedAt,
    }),
    idCard: idCard
      ? {
          url: idCard.downloadUrl ?? idCard.url,
          format: idCard.format,
          generatedAt: idCard.generatedAt.toISOString(),
        }
      : undefined,
    canEdit: editableStatuses.includes(employee.status),
    editUrl: editableStatuses.includes(employee.status)
      ? `/apply`
      : undefined,
  };
}

export async function getEmployeeRedirectPath(
  employeeId: string
): Promise<string> {
  await connectDB();
  const employee = await Employee.findById(employeeId);
  if (!employee) return "/apply";

  const editableStatuses = [
    EmployeeStatus.DRAFT,
    EmployeeStatus.L1_RETURNED,
    EmployeeStatus.L2_RETURNED,
  ];

  if (editableStatuses.includes(employee.status)) {
    return `/apply`;
  }

  return "/apply";
}
