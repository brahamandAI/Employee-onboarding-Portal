"use server";

import { getEmployeeSession } from "@/lib/auth/employee-session";
import {
  saveOnboardingStep,
  updateCurrentStep,
  submitOnboardingApplication,
  getOnboardingEmployee,
  deleteEmployeeDocument,
  OnboardingError,
} from "@/lib/services/onboarding.service";
import { DocumentType } from "@/features/onboarding/constants";
import { revalidatePath } from "next/cache";
import {
  revalidateL1Dashboard,
  revalidateEmployeePortal,
  revalidateSubmitterDashboard,
} from "@/lib/revalidate/staff-dashboard";
import { auth } from "@/lib/auth/config";
import { UserRole } from "@/types/enums";

export type OnboardingActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; code?: string };

async function requireEmployeeSession() {
  const session = await getEmployeeSession();
  if (!session) {
    throw new OnboardingError("Unauthorized", "UNAUTHORIZED");
  }
  return session;
}

export async function saveStepAction(
  step: number,
  data: Record<string, unknown>,
  options?: { validate?: boolean; markComplete?: boolean }
): Promise<OnboardingActionResult<{ savedAt: string }>> {
  try {
    const session = await requireEmployeeSession();
    const result = await saveOnboardingStep(
      session.employeeId,
      step,
      data,
      options
    );
    revalidatePath(`/onboarding/${session.applicationRef}`);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof OnboardingError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to save" };
  }
}

export async function goToStepAction(
  step: number
): Promise<OnboardingActionResult> {
  try {
    const session = await requireEmployeeSession();
    await updateCurrentStep(session.employeeId, step);
    revalidatePath(`/onboarding/${session.applicationRef}`);
    return { success: true };
  } catch (error) {
    if (error instanceof OnboardingError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to update step" };
  }
}

export async function submitApplicationAction(): Promise<OnboardingActionResult> {
  try {
    const session = await requireEmployeeSession();
    const staffSession = await auth();
    const submittedBy =
      staffSession?.user?.role === UserRole.SUBMITTER
        ? staffSession.user.id
        : undefined;
    await submitOnboardingApplication(session.employeeId, { submittedBy });
    revalidatePath(`/onboarding/${session.applicationRef}`);
    revalidateL1Dashboard();
    revalidateSubmitterDashboard();
    revalidateEmployeePortal();
    return { success: true };
  } catch (error) {
    if (error instanceof OnboardingError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to submit application" };
  }
}

export async function deleteDocumentAction(
  documentId: string
): Promise<OnboardingActionResult> {
  try {
    const session = await requireEmployeeSession();
    await deleteEmployeeDocument(session.employeeId, documentId);
    revalidatePath(`/onboarding/${session.applicationRef}`);
    return { success: true };
  } catch (error) {
    if (error instanceof OnboardingError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "Failed to delete document" };
  }
}

export async function fetchOnboardingDataAction(): Promise<
  OnboardingActionResult<Awaited<ReturnType<typeof getOnboardingEmployee>>>
> {
  try {
    const session = await requireEmployeeSession();
    const data = await getOnboardingEmployee(session.employeeId);
    if (!data) {
      return { success: false, error: "Application not found" };
    }
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to load data" };
  }
}

export type { DocumentType };
