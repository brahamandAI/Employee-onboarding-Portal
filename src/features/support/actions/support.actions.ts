"use server";

import { revalidatePath } from "next/cache";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import {
  generateIdCardForEmployee,
  recordIdCardDownload,
  recordIdCardPreview,
  markIdCardCompleted,
  getIdCardPreviewData,
  IdCardError,
} from "@/lib/services/id-card.service";

export type SupportActionResult =
  | { success: true; data?: Record<string, unknown> }
  | { success: false; error: string; code?: string };

function revalidateSupport() {
  revalidatePath("/dashboard/support");
  revalidatePath("/dashboard/support/id-cards/pending");
  revalidatePath("/dashboard/support/id-cards/completed");
  revalidatePath("/dashboard/support/id-cards/generate");
  revalidatePath("/dashboard/support/download-history");
  revalidatePath("/apply");
}

async function requireSupport() {
  const { user } = await requireStaffAuth(UserRole.SUPPORT);
  return user;
}

export async function supportPreviewAction(employeeId: string): Promise<SupportActionResult> {
  const user = await requireSupport();
  try {
    const data = await getIdCardPreviewData(employeeId);
    if (!data) {
      return { success: false, error: "Employee not found", code: "NOT_FOUND" };
    }
    await recordIdCardPreview(employeeId, user.id);
    revalidatePath("/dashboard/support/download-history");
  revalidatePath("/apply");
    return { success: true, data: data as unknown as Record<string, unknown> };
  } catch (error) {
    if (error instanceof IdCardError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Preview failed" };
  }
}

export async function supportGenerateAction(
  employeeId: string
): Promise<SupportActionResult> {
  const user = await requireSupport();
  try {
    const result = await generateIdCardForEmployee(employeeId, user.id);
    revalidateSupport();
    revalidatePath(`/dashboard/support/id-cards/generate/${employeeId}`);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof IdCardError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "ID card generation failed" };
  }
}

export async function supportDownloadAction(
  idCardId: string
): Promise<SupportActionResult> {
  const user = await requireSupport();
  try {
    const result = await recordIdCardDownload(idCardId, user.id);
    revalidatePath("/dashboard/support/download-history");
  revalidatePath("/apply");
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof IdCardError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Download failed" };
  }
}

export async function supportMarkCompletedAction(
  employeeId: string
): Promise<SupportActionResult> {
  const user = await requireSupport();
  try {
    await markIdCardCompleted(employeeId, user.id);
    revalidateSupport();
    revalidatePath(`/dashboard/support/id-cards/generate/${employeeId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof IdCardError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Mark completed failed" };
  }
}

export async function getSupportPreviewDataAction(employeeId: string) {
  await requireSupport();
  return getIdCardPreviewData(employeeId);
}
