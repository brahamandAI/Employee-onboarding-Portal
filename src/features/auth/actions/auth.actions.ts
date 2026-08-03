"use server";

import { signIn, signOut } from "@/lib/auth/config";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import {
  authenticateEmployeePortal,
  verifyEmployeeOtp,
  requestPasswordReset,
  resetPassword,
  logoutEmployee,
  AuthError,
} from "@/lib/services/auth.service";
import {
  staffLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  employeeLoginSchema,
  employeeOtpSchema,
} from "@/features/auth/schemas/auth.schema";
import { STAFF_ROLE_LABELS } from "@/features/auth/constants";
import { ROLE_DASHBOARD_PATH } from "@/types/enums";
import { canAccessRoute } from "@/lib/auth/permissions";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; code?: string };

function resolveStaffRedirect(
  role: keyof typeof ROLE_DASHBOARD_PATH,
  callbackUrl: string
): string {
  const defaultRedirect = ROLE_DASHBOARD_PATH[role];

  if (callbackUrl && callbackUrl.startsWith("/dashboard")) {
    if (canAccessRoute(role, callbackUrl)) {
      return callbackUrl;
    }
  }

  return defaultRedirect;
}

export async function staffLoginAction(
  formData: FormData
): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = staffLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  const callbackUrl = formData.get("callbackUrl")?.toString() ?? "";

  try {
    const result = await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        error: "Invalid email or password",
        code: "INVALID_CREDENTIALS",
      };
    }

    await connectDB();
    const dbUser = await User.findOne({
      email: parsed.data.email.toLowerCase(),
      isActive: true,
    });

    if (!dbUser) {
      await signOut({ redirect: false });
      return { success: false, error: "Authentication failed" };
    }

    if (dbUser.role !== parsed.data.role) {
      await signOut({ redirect: false });
      return {
        success: false,
        error: `Selected role does not match your account. Please choose "${STAFF_ROLE_LABELS[dbUser.role] ?? dbUser.role}".`,
        code: "ROLE_MISMATCH",
      };
    }

    const redirectTo = resolveStaffRedirect(dbUser.role, callbackUrl);
    return { success: true, data: { redirectTo } };
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : String(error ?? "");
    const message = rawMessage.toLowerCase();

    try {
      await connectDB();
      const lockedUser = await User.findOne({
        email: parsed.data.email.toLowerCase(),
        isActive: true,
      }).select("lockedUntil");
      if (lockedUser?.lockedUntil && lockedUser.lockedUntil > new Date()) {
        return {
          success: false,
          error: "Account is temporarily locked. Try again later.",
          code: "ACCOUNT_LOCKED",
        };
      }
    } catch {
      // no-op: preserve existing behavior below
    }

    if (message.includes("locked") || message.includes("callbackrouteerror")) {
      return {
        success: false,
        error: "Account is temporarily locked. Try again later.",
        code: "ACCOUNT_LOCKED",
      };
    }

    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function staffLogoutAction(): Promise<ActionResult> {
  try {
    await signOut({ redirect: false });
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function employeeRequestOtpAction(
  formData: FormData
): Promise<
  ActionResult<{ maskedEmail: string; applicationRef: string; email: string }>
> {
  const parsed = employeeLoginSchema.safeParse({
    applicationRef: formData.get("applicationRef"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  try {
    const result = await authenticateEmployeePortal(
      parsed.data.applicationRef,
      parsed.data.email
    );

    return {
      success: true,
      data: {
        maskedEmail: result.maskedEmail,
        applicationRef: parsed.data.applicationRef.toUpperCase(),
        email: parsed.data.email.toLowerCase(),
      },
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function employeeVerifyOtpAction(
  formData: FormData
): Promise<ActionResult<{ redirectTo: string }>> {
  const parsed = employeeOtpSchema.safeParse({
    applicationRef: formData.get("applicationRef"),
    email: formData.get("email"),
    otp: formData.get("otp"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  try {
    const result = await verifyEmployeeOtp(
      parsed.data.applicationRef,
      parsed.data.email,
      parsed.data.otp
    );

    return { success: true, data: { redirectTo: result.redirectTo } };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function employeeLogoutAction(): Promise<ActionResult> {
  try {
    await logoutEmployee();
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function forgotPasswordAction(
  formData: FormData
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  try {
    await requestPasswordReset(parsed.data.email);
    return { success: true };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function resetPasswordAction(
  formData: FormData
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  try {
    await resetPassword(parsed.data.token, parsed.data.password);
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
