import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Employee } from "@/lib/db/models/Employee";
import { User } from "@/lib/db/models/User";
import { ApprovalHistory } from "@/lib/db/models/ApprovalHistory";
import { EmployeeDocument } from "@/lib/db/models/EmployeeDocument";
import { EmployeeStatus, UserRole } from "@/types/enums";
import {
  generateTemporaryEmployeeId,
} from "@/lib/services/employee-id.service";
import { isPendingL2Review } from "@/lib/services/approval-queue";
import {
  dispatchApplicationSubmitted,
  dispatchL1Approved,
  dispatchL2Approved,
  dispatchCorrectionRequired,
  dispatchRejected,
  dispatchForwardedToSupport,
  employeeNotifyContext,
} from "@/lib/services/notification-dispatch.service";

export class ApprovalError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "ApprovalError";
  }
}

function isTransientDbError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /timed out|timeout|ECONNRESET|ENOTFOUND|MongoNetwork|MongoServerSelection|connection/i.test(
    message
  );
}

async function retryOnce<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (!isTransientDbError(error)) throw error;
    await connectDB();
    return fn();
  }
}

export function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: string }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export function describeApprovalFailure(error: unknown, fallback: string): string {
  if (error instanceof ApprovalError) return error.message;
  if (isTransientDbError(error)) {
    return "Connection timed out. Please click Approve again.";
  }
  if (error instanceof Error && error.message && error.message.length < 160) {
    return error.message;
  }
  return fallback;
}

async function recordHistory(params: {
  employeeId: mongoose.Types.ObjectId;
  fromStatus: string;
  toStatus: string;
  action: string;
  performedBy: string;
  performedByRole: string;
  comment?: string;
}) {
  await ApprovalHistory.create({
    employeeId: params.employeeId,
    fromStatus: params.fromStatus,
    toStatus: params.toStatus,
    action: params.action,
    performedBy: new mongoose.Types.ObjectId(params.performedBy),
    performedByRole: params.performedByRole,
    comment: params.comment,
  });
}

export async function assignL1OnSubmit(
  employeeId: string,
  options?: { performedBy?: string; isResubmit?: boolean }
): Promise<void> {
  await connectDB();
  const l1User = await User.findOne({ role: UserRole.L1, isActive: true }).sort({
    createdAt: 1,
  });

  const employee = await Employee.findById(employeeId);
  if (!employee) return;

  const fromStatus = employee.status;
  employee.status = EmployeeStatus.L1_REVIEW;
  if (l1User) {
    employee.assignedL1Id = l1User._id;
  }
  await employee.save();

  const performer =
    options?.performedBy ||
    employee.submittedBy?.toString() ||
    l1User?._id.toString();

  if (performer) {
    await recordHistory({
      employeeId: employee._id,
      fromStatus,
      toStatus: EmployeeStatus.L1_REVIEW,
      action: options?.isResubmit ? "RESUBMIT" : "SUBMIT",
      performedBy: performer,
      performedByRole: UserRole.SUBMITTER,
      comment: options?.isResubmit
        ? "Registration updated and resubmitted"
        : "Registration submitted for L1 approval",
    });
  }

  void dispatchApplicationSubmitted(
    employeeNotifyContext(employee),
    l1User?._id.toString()
  ).catch(() => undefined);
}

export async function performL1Approve(
  employeeId: string,
  reviewerId: string,
  approvedByName: string,
  comment?: string
): Promise<{ employeeIdCode?: string }> {
  const trimmedName = approvedByName?.trim() ?? "";
  if (trimmedName.length < 2) {
    throw new ApprovalError("Enter the L1 name in Approved by", "VALIDATION");
  }
  if (!mongoose.isValidObjectId(employeeId)) {
    throw new ApprovalError("Application not found", "NOT_FOUND");
  }
  if (!mongoose.isValidObjectId(reviewerId)) {
    throw new ApprovalError("Please sign in again to approve", "AUTH");
  }

  await connectDB();

  const now = new Date();
  const updated = await retryOnce(() =>
    Employee.findOneAndUpdate(
      {
        _id: employeeId,
        status: { $in: [EmployeeStatus.SUBMITTED, EmployeeStatus.L1_REVIEW] },
      },
      {
        $set: {
          status: EmployeeStatus.L2_REVIEW,
          l1Decision: {
            action: "APPROVE",
            comment,
            approvedByName: trimmedName,
            decidedBy: new mongoose.Types.ObjectId(reviewerId),
            decidedAt: now,
          },
          l1ApprovedAt: now,
        },
        $unset: { correctionNotes: "", l2Decision: "" },
      },
      { new: true }
    )
  );

  if (!updated) {
    const existing = await Employee.findById(employeeId)
      .select("status l1Decision")
      .lean();
    if (!existing) throw new ApprovalError("Application not found", "NOT_FOUND");
    if (
      existing.status === EmployeeStatus.L2_REVIEW &&
      existing.l1Decision?.action === "APPROVE"
    ) {
      return {};
    }
    throw new ApprovalError("Application is not in L1 review", "INVALID_STATUS");
  }

  void recordHistory({
    employeeId: updated._id,
    fromStatus: EmployeeStatus.L1_REVIEW,
    toStatus: EmployeeStatus.L2_REVIEW,
    action: "L1_APPROVE",
    performedBy: reviewerId,
    performedByRole: UserRole.L1,
    comment: [`Approved by ${trimmedName}`, comment?.trim()]
      .filter(Boolean)
      .join(" — "),
  }).catch((error) => console.error("[l1-approve] history", error));

  void dispatchL1Approved(employeeNotifyContext(updated)).catch(() => undefined);

  return {};
}

export async function performL1Reject(
  employeeId: string,
  reviewerId: string,
  comment: string
): Promise<void> {
  if (!comment || comment.trim().length < 10) {
    throw new ApprovalError(
      "Rejection reason must be at least 10 characters",
      "VALIDATION"
    );
  }

  await connectDB();
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new ApprovalError("Application not found", "NOT_FOUND");

  const allowed = [EmployeeStatus.SUBMITTED, EmployeeStatus.L1_REVIEW];
  if (!allowed.includes(employee.status)) {
    throw new ApprovalError("Application is not in L1 review", "INVALID_STATUS");
  }

  const fromStatus = employee.status;
  employee.status = EmployeeStatus.REJECTED;
  employee.rejectionReason = comment;
  employee.l1Decision = {
    action: "REJECT",
    comment,
    decidedBy: new mongoose.Types.ObjectId(reviewerId),
    decidedAt: new Date(),
  };
  await employee.save();

  await recordHistory({
    employeeId: employee._id,
    fromStatus,
    toStatus: EmployeeStatus.REJECTED,
    action: "L1_REJECT",
    performedBy: reviewerId,
    performedByRole: UserRole.L1,
    comment,
  });

  void dispatchRejected(employeeNotifyContext(employee), "L1", comment).catch(
    () => undefined
  );
}

export async function performL1Return(
  employeeId: string,
  reviewerId: string,
  comment: string
): Promise<void> {
  if (!comment || comment.trim().length < 10) {
    throw new ApprovalError(
      "Correction notes must be at least 10 characters",
      "VALIDATION"
    );
  }

  await connectDB();
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new ApprovalError("Application not found", "NOT_FOUND");

  const allowed = [EmployeeStatus.SUBMITTED, EmployeeStatus.L1_REVIEW];
  if (!allowed.includes(employee.status)) {
    throw new ApprovalError("Application is not in L1 review", "INVALID_STATUS");
  }

  const fromStatus = employee.status;
  employee.status = EmployeeStatus.L1_RETURNED;
  employee.correctionNotes = comment;
  employee.l1Decision = {
    action: "RETURN",
    comment,
    decidedBy: new mongoose.Types.ObjectId(reviewerId),
    decidedAt: new Date(),
  };
  await employee.save();

  await recordHistory({
    employeeId: employee._id,
    fromStatus,
    toStatus: EmployeeStatus.L1_RETURNED,
    action: "L1_RETURN",
    performedBy: reviewerId,
    performedByRole: UserRole.L1,
    comment,
  });

  void dispatchCorrectionRequired(employeeNotifyContext(employee), "L1", comment).catch(
    () => undefined
  );
}

export async function getEmployeeDetailForReview(employeeId: string) {
  await connectDB();
  const [employee, documents, history] = await Promise.all([
    Employee.findById(employeeId)
      .populate("submittedBy", "name email")
      .populate("l1Decision.decidedBy", "name email")
      .populate("l2Decision.decidedBy", "name email")
      .lean(),
    EmployeeDocument.find({
      employeeId,
      isActive: true,
    }).lean(),
    ApprovalHistory.find({ employeeId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("performedBy", "name")
      .lean(),
  ]);

  if (!employee) return null;

  return { employee, documents, history };
}

function assertPendingL2Review(
  employee: {
    status: EmployeeStatus;
    l1Decision?: { action?: string };
    l2Decision?: { action?: string };
    forwardedToSupportAt?: Date;
  }
) {
  if (!isPendingL2Review(employee)) {
    throw new ApprovalError("Application is not in L2 review", "INVALID_STATUS");
  }
}

export async function performL2Approve(
  employeeId: string,
  reviewerId: string,
  comment?: string
): Promise<{ employeeIdCode?: string }> {
  if (!mongoose.isValidObjectId(employeeId)) {
    throw new ApprovalError("Application not found", "NOT_FOUND");
  }
  if (!mongoose.isValidObjectId(reviewerId)) {
    throw new ApprovalError("Please sign in again to approve", "AUTH");
  }

  await connectDB();
  const employee = await retryOnce(() => Employee.findById(employeeId));
  if (!employee) throw new ApprovalError("Application not found", "NOT_FOUND");

  const alreadyDone =
    employee.l2Decision?.action === "APPROVE" ||
    employee.l2Decision?.action === "FORWARD" ||
    !!employee.forwardedToAdminAt ||
    !!employee.temporaryEmployeeId;

  if (!alreadyDone) {
    assertPendingL2Review(employee);

    const fromStatus = employee.status;
    const now = new Date();
    employee.status = EmployeeStatus.APPROVED;
    employee.l2Decision = {
      action: "APPROVE",
      comment,
      decidedBy: new mongoose.Types.ObjectId(reviewerId),
      decidedAt: now,
    };
    employee.approvedAt = now;
    await retryOnce(() => employee.save());

    void recordHistory({
      employeeId: employee._id,
      fromStatus,
      toStatus: EmployeeStatus.APPROVED,
      action: "L2_APPROVE",
      performedBy: reviewerId,
      performedByRole: UserRole.L2,
      comment,
    }).catch((error) => console.error("[l2-approve] history", error));

    void dispatchL2Approved(employeeNotifyContext(employee)).catch(() => undefined);
  }

  let employeeIdCode = employee.temporaryEmployeeId;

  try {
    const result = await generateTemporaryEmployeeId(employeeId);
    employeeIdCode = result.employeeIdCode;

    void recordHistory({
      employeeId: employee._id,
      fromStatus: EmployeeStatus.APPROVED,
      toStatus: EmployeeStatus.ID_GENERATED,
      action: "GENERATE_ID",
      performedBy: reviewerId,
      performedByRole: UserRole.L2,
      comment: `Temporary Employee ID ${employeeIdCode} assigned`,
    }).catch(() => undefined);
  } catch (error) {
    console.error("[l2-approve] temp ID", error);
  }

  void import("@/lib/services/employee-documents-folder.service")
    .then(({ organizeEmployeeDocumentsFolder }) =>
      organizeEmployeeDocumentsFolder(employeeId)
    )
    .catch(() => undefined);

  try {
    await Employee.updateOne(
      {
        _id: employeeId,
        forwardedToAdminAt: { $exists: false },
      },
      {
        $set: {
          forwardedToAdminAt: new Date(),
          status: EmployeeStatus.ID_GENERATED,
        },
      }
    );
  } catch (error) {
    console.error("[l2-approve] forward admin", error);
  }

  return { employeeIdCode };
}

export async function performL2Reject(
  employeeId: string,
  reviewerId: string,
  comment: string
): Promise<void> {
  if (!comment || comment.trim().length < 10) {
    throw new ApprovalError(
      "Rejection reason must be at least 10 characters",
      "VALIDATION"
    );
  }

  await connectDB();
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new ApprovalError("Application not found", "NOT_FOUND");

  assertPendingL2Review(employee);

  const fromStatus = employee.status;
  employee.status = EmployeeStatus.REJECTED;
  employee.rejectionReason = comment;
  employee.l2Decision = {
    action: "REJECT",
    comment,
    decidedBy: new mongoose.Types.ObjectId(reviewerId),
    decidedAt: new Date(),
  };
  await employee.save();

  await recordHistory({
    employeeId: employee._id,
    fromStatus,
    toStatus: EmployeeStatus.REJECTED,
    action: "L2_REJECT",
    performedBy: reviewerId,
    performedByRole: UserRole.L2,
    comment,
  });

  void dispatchRejected(employeeNotifyContext(employee), "L2", comment).catch(
    () => undefined
  );
}

export async function performL2Return(
  employeeId: string,
  reviewerId: string,
  comment: string
): Promise<void> {
  if (!comment || comment.trim().length < 10) {
    throw new ApprovalError(
      "Send-back notes must be at least 10 characters",
      "VALIDATION"
    );
  }

  await connectDB();
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new ApprovalError("Application not found", "NOT_FOUND");

  assertPendingL2Review(employee);

  const fromStatus = employee.status;
  employee.status = EmployeeStatus.L2_RETURNED;
  employee.correctionNotes = comment;
  employee.l2Decision = {
    action: "RETURN",
    comment,
    decidedBy: new mongoose.Types.ObjectId(reviewerId),
    decidedAt: new Date(),
  };
  await employee.save();

  await recordHistory({
    employeeId: employee._id,
    fromStatus,
    toStatus: EmployeeStatus.L2_RETURNED,
    action: "L2_RETURN",
    performedBy: reviewerId,
    performedByRole: UserRole.L2,
    comment,
  });

  void dispatchCorrectionRequired(employeeNotifyContext(employee), "L2", comment).catch(
    () => undefined
  );
}

/** L2 sends application back to L1 for re-review with a note. */
export async function performL2ReturnToL1(
  employeeId: string,
  reviewerId: string,
  comment: string
): Promise<void> {
  if (!comment || comment.trim().length < 10) {
    throw new ApprovalError(
      "Send-back notes must be at least 10 characters",
      "VALIDATION"
    );
  }

  await connectDB();
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new ApprovalError("Application not found", "NOT_FOUND");

  assertPendingL2Review(employee);

  const fromStatus = employee.status;
  employee.status = EmployeeStatus.L1_REVIEW;
  employee.correctionNotes = comment;
  employee.l1Decision = undefined;
  employee.l1ApprovedAt = undefined;
  // Keep the L2 trail so the send-back stays visible on the L2 reversed list
  // until L1 re-approves it.
  employee.l2Decision = {
    action: "RETURN_TO_L1",
    comment,
    decidedBy: new mongoose.Types.ObjectId(reviewerId),
    decidedAt: new Date(),
  };
  await employee.save();

  await recordHistory({
    employeeId: employee._id,
    fromStatus,
    toStatus: EmployeeStatus.L1_REVIEW,
    action: "L2_RETURN_TO_L1",
    performedBy: reviewerId,
    performedByRole: UserRole.L2,
    comment,
  });

  void dispatchCorrectionRequired(employeeNotifyContext(employee), "L2", comment).catch(
    () => undefined
  );
}

export async function performForwardToSupport(
  employeeId: string,
  reviewerId: string,
  comment?: string
): Promise<void> {
  await connectDB();
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new ApprovalError("Application not found", "NOT_FOUND");

  const allowed = [
    EmployeeStatus.APPROVED,
    EmployeeStatus.ID_GENERATED,
  ];
  if (!allowed.includes(employee.status)) {
    throw new ApprovalError(
      "Application must be approved before forwarding to Support",
      "INVALID_STATUS"
    );
  }

  if (employee.l2Decision?.action !== "APPROVE") {
    throw new ApprovalError(
      "Only L2-approved applications can be forwarded",
      "INVALID_STATUS"
    );
  }

  if (employee.forwardedToSupportAt) {
    throw new ApprovalError(
      "Application already forwarded to Support",
      "ALREADY_FORWARDED"
    );
  }

  if (!employee.employeeId && !employee.temporaryEmployeeId) {
    try {
      await generateTemporaryEmployeeId(employeeId);
    } catch {
      throw new ApprovalError(
        "Employee ID must be generated before forwarding to Support",
        "NO_EMPLOYEE_ID"
      );
    }
  }

  try {
    const { organizeEmployeeDocumentsFolder } = await import(
      "@/lib/services/employee-documents-folder.service"
    );
    const current = await Employee.findById(employeeId);
    if (current && !current.documentsFolder?.folderPath) {
      await organizeEmployeeDocumentsFolder(employeeId);
    }
  } catch {
    // non-blocking
  }

  const fromStatus = employee.status;
  employee.forwardedToSupportAt = new Date();
  employee.l2Decision = {
    ...employee.l2Decision,
    action: "FORWARD",
    comment: comment ?? employee.l2Decision.comment,
    decidedBy: employee.l2Decision.decidedBy,
    decidedAt: new Date(),
  };
  await employee.save();

  await recordHistory({
    employeeId: employee._id,
    fromStatus,
    toStatus: employee.status,
    action: "L2_FORWARD",
    performedBy: reviewerId,
    performedByRole: UserRole.L2,
    comment,
  });

  void dispatchForwardedToSupport(employeeNotifyContext(employee)).catch(
    () => undefined
  );
}
