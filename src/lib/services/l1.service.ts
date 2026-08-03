import { connectDB } from "@/lib/db/connect";
import { Employee } from "@/lib/db/models/Employee";
import { EmployeeStatus } from "@/types/enums";
import { L1_PENDING_FILTER } from "@/lib/services/approval-queue";

export interface ApplicationListItem {
  _id: string;
  applicationRef: string;
  fullName: string;
  email: string;
  phone: string;
  postAppliedFor?: string;
  status: EmployeeStatus;
  submittedAt?: string;
  employeeId?: string;
  l1ApprovedAt?: string;
  submittedByName?: string;
  l1ApprovedByName?: string;
}

function mapEmployee(emp: Record<string, unknown>): ApplicationListItem {
  const personal = emp.personalDetails as { fullName?: string; postAppliedFor?: string } | undefined;
  const submittedBy = emp.submittedBy as { name?: string } | null | undefined;
  const l1Decision = emp.l1Decision as
    | { decidedBy?: { name?: string } | null }
    | undefined;
  return {
    _id: String(emp._id),
    applicationRef: String(emp.applicationRef),
    fullName: personal?.fullName ?? "Unknown",
    email: String(emp.email),
    phone: String(emp.phone),
    postAppliedFor: personal?.postAppliedFor,
    status: emp.status as EmployeeStatus,
    submittedAt: emp.submittedAt
      ? new Date(emp.submittedAt as Date).toISOString()
      : undefined,
    employeeId: emp.employeeId as string | undefined,
    l1ApprovedAt: emp.l1ApprovedAt
      ? new Date(emp.l1ApprovedAt as Date).toISOString()
      : undefined,
    submittedByName:
      submittedBy && typeof submittedBy === "object" && submittedBy.name
        ? submittedBy.name
        : undefined,
    l1ApprovedByName: l1Decision?.decidedBy?.name,
  };
}

export async function getL1Stats(l1UserId: string) {
  await connectDB();

  const [pending, approved, rejected, returnedToday] = await Promise.all([
    Employee.countDocuments(L1_PENDING_FILTER),
    Employee.countDocuments({
      "l1Decision.action": "APPROVE",
      "l1Decision.decidedBy": l1UserId,
    }),
    Employee.countDocuments({
      $or: [
        { status: EmployeeStatus.L1_RETURNED, "l1Decision.decidedBy": l1UserId },
        {
          status: EmployeeStatus.L2_RETURNED,
          "l1Decision.action": "APPROVE",
          "l1Decision.decidedBy": l1UserId,
        },
        { status: EmployeeStatus.REJECTED, "l1Decision.decidedBy": l1UserId },
      ],
    }),
    Employee.countDocuments({
      status: EmployeeStatus.L1_RETURNED,
      "l1Decision.decidedBy": l1UserId,
      "l1Decision.decidedAt": {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    }),
  ]);

  return { pending, approved, rejected, returnedToday };
}

export async function getL1PendingApplications(): Promise<ApplicationListItem[]> {
  await connectDB();
  const items = await Employee.find(L1_PENDING_FILTER)
    .populate("submittedBy", "name")
    .sort({ submittedAt: -1 })
    .limit(50)
    .lean();

  return items.map(mapEmployee);
}

export async function getL1ApprovedApplications(
  l1UserId: string
): Promise<ApplicationListItem[]> {
  await connectDB();
  const items = await Employee.find({
    "l1Decision.action": "APPROVE",
    "l1Decision.decidedBy": l1UserId,
  })
    .populate("submittedBy", "name")
    .sort({ l1ApprovedAt: -1 })
    .limit(50)
    .lean();

  return items.map(mapEmployee);
}

export async function getL1RejectedApplications(
  l1UserId: string
): Promise<ApplicationListItem[]> {
  await connectDB();
  const items = await Employee.find({
    $or: [
      { status: EmployeeStatus.L1_RETURNED, "l1Decision.decidedBy": l1UserId },
      {
        status: EmployeeStatus.L2_RETURNED,
        "l1Decision.action": "APPROVE",
        "l1Decision.decidedBy": l1UserId,
      },
      { status: EmployeeStatus.REJECTED, "l1Decision.decidedBy": l1UserId },
    ],
  })
    .populate("submittedBy", "name")
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

  return items.map(mapEmployee);
}

export async function getL1AllApprovedRegistrations(): Promise<ApplicationListItem[]> {
  await connectDB();
  const items = await Employee.find({
    status: {
      $in: [
        EmployeeStatus.APPROVED,
        EmployeeStatus.ID_GENERATED,
        EmployeeStatus.ID_CARD_ISSUED,
      ],
    },
    temporaryEmployeeId: { $exists: true, $ne: null },
    "l1Decision.action": "APPROVE",
  })
    .populate("submittedBy", "name")
    .sort({ approvedAt: -1, l1ApprovedAt: -1 })
    .limit(200)
    .lean();

  return items.map(mapEmployee);
}

export async function getL1RecentPending(limit = 5): Promise<ApplicationListItem[]> {
  await connectDB();
  const items = await Employee.find(L1_PENDING_FILTER)
    .populate("submittedBy", "name")
    .sort({ submittedAt: -1 })
    .limit(limit)
    .lean();

  return items.map(mapEmployee);
}
