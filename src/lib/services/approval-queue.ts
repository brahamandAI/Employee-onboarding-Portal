import { EmployeeStatus } from "@/types/enums";

/** Applications waiting for L1 review */
export const L1_PENDING_FILTER = {
  status: { $in: [EmployeeStatus.SUBMITTED, EmployeeStatus.L1_REVIEW] },
};

export const L2_REVIEWABLE_STATUSES = [EmployeeStatus.L2_REVIEW] as const;

type L2ReviewCheck = {
  status: EmployeeStatus;
  l1Decision?: { action?: string };
  l2Decision?: { action?: string };
  forwardedToAdminAt?: unknown;
  forwardedToSupportAt?: unknown;
};

/** True when L2 can still approve or reject the application */
export function isPendingL2Review(employee: L2ReviewCheck): boolean {
  if (employee.forwardedToAdminAt || employee.forwardedToSupportAt) return false;
  if (employee.l1Decision?.action !== "APPROVE") return false;
  if (
    employee.l2Decision?.action &&
    ["APPROVE", "FORWARD", "REJECT", "RETURN"].includes(employee.l2Decision.action)
  ) {
    return false;
  }
  return L2_REVIEWABLE_STATUSES.includes(
    employee.status as (typeof L2_REVIEWABLE_STATUSES)[number]
  );
}

/**
 * Applications waiting for L2 review after L1 approval.
 * Temporary Employee ID is generated only after L2 approval.
 */
export const L2_PENDING_FILTER = {
  "l1Decision.action": "APPROVE",
  forwardedToAdminAt: { $exists: false },
  forwardedToSupportAt: { $exists: false },
  status: EmployeeStatus.L2_REVIEW,
  $or: [
    { l2Decision: { $exists: false } },
    { "l2Decision.action": { $nin: ["APPROVE", "FORWARD", "REJECT", "RETURN"] } },
  ],
};

/** Registrations L2-approved and sent to Admin */
export const ADMIN_REGISTRATIONS_FILTER = {
  forwardedToAdminAt: { $exists: true },
  temporaryEmployeeId: { $exists: true, $ne: null },
  "l2Decision.action": { $in: ["APPROVE", "FORWARD"] },
  status: {
    $in: [
      EmployeeStatus.APPROVED,
      EmployeeStatus.ID_GENERATED,
      EmployeeStatus.ID_CARD_ISSUED,
    ],
  },
};

/** Employees L2-approved and forwarded to Support for ID card generation */
export const SUPPORT_PENDING_FILTER = {
  forwardedToSupportAt: { $exists: true },
  employeeId: { $exists: true, $ne: null },
  "l2Decision.action": { $in: ["APPROVE", "FORWARD"] },
  status: { $in: [EmployeeStatus.APPROVED, EmployeeStatus.ID_GENERATED] },
};
