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
  comment?: string
): Promise<{ employeeIdCode?: string }> {
  await connectDB();
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new ApprovalError("Application not found", "NOT_FOUND");

  const allowed = [EmployeeStatus.SUBMITTED, EmployeeStatus.L1_REVIEW];
  if (!allowed.includes(employee.status)) {
    throw new ApprovalError("Application is not in L1 review", "INVALID_STATUS");
  }

  const fromStatus = employee.status;
  employee.status = EmployeeStatus.L2_REVIEW;
  employee.l1Decision = {
    action: "APPROVE",
    comment,
    decidedBy: new mongoose.Types.ObjectId(reviewerId),
    decidedAt: new Date(),
  };
  employee.l1ApprovedAt = new Date();
  employee.correctionNotes = undefined;
  const clearL2SendBack = employee.l2Decision?.action === "RETURN_TO_L1";
  await employee.save();

  // A previous L2 send-back is resolved once L1 re-approves, so the application
  // leaves the L2 reversed list and re-enters the L2 queue.
  if (clearL2SendBack) {
    await Employee.updateOne(
      { _id: employee._id },
      { $unset: { l2Decision: "" } }
    );
  }

  await recordHistory({
    employeeId: employee._id,
    fromStatus,
    toStatus: EmployeeStatus.L2_REVIEW,
    action: "L1_APPROVE",
    performedBy: reviewerId,
    performedByRole: UserRole.L1,
    comment,
  });

  void dispatchL1Approved(employeeNotifyContext(employee)).catch(() => undefined);

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
  const employee = await Employee.findById(employeeId)
    .populate("submittedBy", "name email")
    .populate("l1Decision.decidedBy", "name email")
    .populate("l2Decision.decidedBy", "name email")
    .lean();
  if (!employee) return null;

  const documents = await EmployeeDocument.find({
    employeeId,
    isActive: true,
  }).lean();

  const history = await ApprovalHistory.find({ employeeId })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("performedBy", "name")
    .lean();

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
  await connectDB();
  const employee = await Employee.findById(employeeId);
  if (!employee) throw new ApprovalError("Application not found", "NOT_FOUND");

  assertPendingL2Review(employee);

  const fromStatus = employee.status;
  employee.status = EmployeeStatus.APPROVED;
  employee.l2Decision = {
    action: "APPROVE",
    comment,
    decidedBy: new mongoose.Types.ObjectId(reviewerId),
    decidedAt: new Date(),
  };
  employee.approvedAt = new Date();
  await employee.save();

  await recordHistory({
    employeeId: employee._id,
    fromStatus,
    toStatus: EmployeeStatus.APPROVED,
    action: "L2_APPROVE",
    performedBy: reviewerId,
    performedByRole: UserRole.L2,
    comment,
  });

  void dispatchL2Approved(employeeNotifyContext(employee)).catch(() => undefined);

  const result = await generateTemporaryEmployeeId(employeeId);
  const employeeIdCode = result.employeeIdCode;
  await recordHistory({
    employeeId: employee._id,
    fromStatus: EmployeeStatus.APPROVED,
    toStatus: EmployeeStatus.ID_GENERATED,
    action: "GENERATE_ID",
    performedBy: reviewerId,
    performedByRole: UserRole.L2,
    comment: `Temporary Employee ID ${employeeIdCode} assigned`,
  });

  // Do not block the approve response on Cloudinary folder work
  void import("@/lib/services/employee-documents-folder.service")
    .then(({ organizeEmployeeDocumentsFolder }) =>
      organizeEmployeeDocumentsFolder(employeeId)
    )
    .catch(() => undefined);

  const refreshed = await Employee.findById(employeeId);
  if (refreshed && !refreshed.forwardedToAdminAt) {
    refreshed.forwardedToAdminAt = new Date();
    refreshed.status = EmployeeStatus.ID_GENERATED;
    await refreshed.save();

    await recordHistory({
      employeeId: refreshed._id,
      fromStatus: EmployeeStatus.ID_GENERATED,
      toStatus: EmployeeStatus.ID_GENERATED,
      action: "L2_FORWARD_ADMIN",
      performedBy: reviewerId,
      performedByRole: UserRole.L2,
      comment: "Auto-forwarded to Admin after L2 approval",
    });
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
