"use server";

import { revalidatePath } from "next/cache";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import {
  performL1Approve,
  performL1Reject,
  performL1Return,
  ApprovalError,
  isNextRedirectError,
  describeApprovalFailure,
} from "@/lib/services/approval.service";
import {
  l1ApproveSchema,
  l1RejectSchema,
  l1ReturnSchema,
} from "@/features/l1/schemas/approval.schema";

export type L1ActionResult =
  | { success: true; data?: { employeeIdCode?: string } }
  | { success: false; error: string; code?: string };

async function requireL1() {
  const { user } = await requireStaffAuth(UserRole.L1);
  return user;
}

function revalidateAfterL1Action(employeeId: string) {
  // Keep revalidation lean so approve/reverse return quickly
  revalidatePath(`/dashboard/l1/applications/${employeeId}`);
  revalidatePath("/dashboard/l1");
  revalidatePath("/dashboard/l1/applications/pending");
  revalidatePath("/dashboard/l1/applications/approved");
  revalidatePath("/dashboard/l1/applications/rejected");
  revalidatePath("/dashboard/l1/applications/reversed-from-l2");
  revalidatePath("/dashboard/l1/applications/all");
  revalidatePath("/dashboard/l2");
  revalidatePath("/dashboard/l2/applications/pending");
  revalidatePath("/dashboard/l2/applications/rejected");
  revalidatePath("/dashboard/submitter");
  revalidatePath("/dashboard/submitter/registrations");
  revalidatePath("/dashboard/submitter/registrations/reversed");
  revalidatePath(`/dashboard/submitter/registrations/${employeeId}`);
}

export async function l1ApproveAction(
  formData: FormData
): Promise<L1ActionResult> {
  const user = await requireL1();
  const parsed = l1ApproveSchema.safeParse({
    employeeId: formData.get("employeeId"),
    approvedByName: formData.get("approvedByName"),
    comment: formData.get("comment") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  try {
    const result = await performL1Approve(
      parsed.data.employeeId,
      user.id,
      parsed.data.approvedByName,
      parsed.data.comment
    );
    try {
      revalidateAfterL1Action(parsed.data.employeeId);
    } catch (error) {
      console.error("[l1-approve] revalidate", error);
    }
    return { success: true, data: result };
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof ApprovalError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error("[l1-approve]", error);
    return {
      success: false,
      error: describeApprovalFailure(error, "Approval failed"),
    };
  }
}

export async function l1RejectAction(formData: FormData): Promise<L1ActionResult> {
  const user = await requireL1();
  const parsed = l1RejectSchema.safeParse({
    employeeId: formData.get("employeeId"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  try {
    await performL1Reject(parsed.data.employeeId, user.id, parsed.data.comment);
    revalidateAfterL1Action(parsed.data.employeeId);
    return { success: true };
  } catch (error) {
    if (error instanceof ApprovalError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Rejection failed" };
  }
}

export async function l1ReturnAction(formData: FormData): Promise<L1ActionResult> {
  const user = await requireL1();
  const parsed = l1ReturnSchema.safeParse({
    employeeId: formData.get("employeeId"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  try {
    await performL1Return(parsed.data.employeeId, user.id, parsed.data.comment);
    revalidateAfterL1Action(parsed.data.employeeId);
    return { success: true };
  } catch (error) {
    if (error instanceof ApprovalError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Return failed" };
  }
}
