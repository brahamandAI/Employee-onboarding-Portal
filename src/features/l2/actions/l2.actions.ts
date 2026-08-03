"use server";

import { revalidatePath } from "next/cache";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import {
  performL2Approve,
  performL2Reject,
  performL2Return,
  performL2ReturnToL1,
  performForwardToSupport,
  ApprovalError,
} from "@/lib/services/approval.service";
import {
  l2ApproveSchema,
  l2RejectSchema,
  l2ReturnSchema,
  l2ReturnToL1Schema,
  l2ForwardSchema,
} from "@/features/l2/schemas/approval.schema";

export type L2ActionResult =
  | { success: true; data?: { employeeIdCode?: string } }
  | { success: false; error: string; code?: string };

async function requireL2() {
  const { user } = await requireStaffAuth(UserRole.L2);
  return user;
}

function revalidateL2(employeeId?: string) {
  if (employeeId) {
    revalidatePath(`/dashboard/l2/applications/${employeeId}`);
    revalidatePath(`/dashboard/l1/applications/${employeeId}`);
  }
  revalidatePath("/dashboard/l2");
  revalidatePath("/dashboard/l2/applications/pending");
  revalidatePath("/dashboard/l2/applications/approved");
  revalidatePath("/dashboard/l2/applications/rejected");
  revalidatePath("/dashboard/l2/applications/all");
  revalidatePath("/dashboard/l1");
  revalidatePath("/dashboard/l1/applications/pending");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/registrations");
  revalidatePath("/dashboard/support");
  revalidatePath("/dashboard/support/registrations");
  revalidatePath("/dashboard/submitter");
  revalidatePath("/dashboard/submitter/registrations");
  revalidatePath("/dashboard/submitter/registrations/reversed");
}

export async function l2ApproveAction(
  formData: FormData
): Promise<L2ActionResult> {
  const user = await requireL2();
  const parsed = l2ApproveSchema.safeParse({
    employeeId: formData.get("employeeId"),
    comment: formData.get("comment") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  try {
    const result = await performL2Approve(
      parsed.data.employeeId,
      user.id,
      parsed.data.comment
    );
    revalidateL2(parsed.data.employeeId);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ApprovalError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Approval failed" };
  }
}

export async function l2RejectAction(
  formData: FormData
): Promise<L2ActionResult> {
  const user = await requireL2();
  const parsed = l2RejectSchema.safeParse({
    employeeId: formData.get("employeeId"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  try {
    await performL2Reject(parsed.data.employeeId, user.id, parsed.data.comment);
    revalidateL2(parsed.data.employeeId);
    return { success: true };
  } catch (error) {
    if (error instanceof ApprovalError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Rejection failed" };
  }
}

export async function l2ReturnAction(
  formData: FormData
): Promise<L2ActionResult> {
  const user = await requireL2();
  const parsed = l2ReturnSchema.safeParse({
    employeeId: formData.get("employeeId"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  try {
    await performL2Return(parsed.data.employeeId, user.id, parsed.data.comment);
    revalidateL2(parsed.data.employeeId);
    return { success: true };
  } catch (error) {
    if (error instanceof ApprovalError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Send back failed" };
  }
}

export async function l2ReturnToL1Action(
  formData: FormData
): Promise<L2ActionResult> {
  const user = await requireL2();
  const parsed = l2ReturnToL1Schema.safeParse({
    employeeId: formData.get("employeeId"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  try {
    await performL2ReturnToL1(parsed.data.employeeId, user.id, parsed.data.comment);
    revalidateL2(parsed.data.employeeId);
    return { success: true };
  } catch (error) {
    if (error instanceof ApprovalError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Send back to L1 failed" };
  }
}

export async function l2ForwardAction(
  formData: FormData
): Promise<L2ActionResult> {
  const user = await requireL2();
  const parsed = l2ForwardSchema.safeParse({
    employeeId: formData.get("employeeId"),
    comment: formData.get("comment") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  try {
    await performForwardToSupport(
      parsed.data.employeeId,
      user.id,
      parsed.data.comment
    );
    revalidateL2(parsed.data.employeeId);
    return { success: true };
  } catch (error) {
    if (error instanceof ApprovalError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Forward to Support failed" };
  }
}

