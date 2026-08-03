import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Employee } from "@/lib/db/models/Employee";
import { OtpToken } from "@/lib/db/models/OtpToken";
import { hashPassword, hashToken, verifyToken } from "@/lib/auth/password";
import {
  createEmployeeSession,
  setEmployeeSessionCookie,
  createPasswordResetToken,
  verifyPasswordResetToken,
} from "@/lib/auth/employee-session";
import { generateOtp, getBaseUrl } from "@/lib/utils";
import { EmployeeStatus } from "@/types/enums";
import { AuthError } from "@/lib/auth/errors";
import crypto from "crypto";

const OTP_EXPIRY_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;

export { AuthError };

export async function authenticateEmployeePortal(
  applicationRef: string,
  email: string
): Promise<{ otpSent: boolean; maskedEmail: string }> {
  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedRef = applicationRef.trim().toUpperCase();

  const employee = await Employee.findOne({
    applicationRef: normalizedRef,
    email: normalizedEmail,
  });

  if (!employee) {
    throw new AuthError(
      "Invalid application reference or email",
      "INVALID_CREDENTIALS"
    );
  }

  const otp = generateOtp();
  const hashedOtp = await hashToken(otp);

  await OtpToken.deleteMany({
    applicationRef: normalizedRef,
    email: normalizedEmail,
  });

  await OtpToken.create({
    applicationRef: normalizedRef,
    email: normalizedEmail,
    hashedOtp,
    purpose: "FORM_ACCESS",
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    attempts: 0,
  });

  // Log OTP in development; integrate email provider in production
  if (process.env.NODE_ENV === "development") {
    console.info(`[DEV OTP] ${normalizedRef}: ${otp}`);
  }

  const maskedEmail = normalizedEmail.replace(
    /(.{1,2})(.*)(@.*)/,
    (_, a, b, c) => `${a}${"*".repeat(Math.min(b.length, 4))}${c}`
  );

  return { otpSent: true, maskedEmail };
}

export async function verifyEmployeeOtp(
  applicationRef: string,
  email: string,
  otp: string
): Promise<{ redirectTo: string }> {
  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedRef = applicationRef.trim().toUpperCase();

  const otpRecord = await OtpToken.findOne({
    applicationRef: normalizedRef,
    email: normalizedEmail,
    usedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    throw new AuthError("OTP expired or not found", "OTP_EXPIRED");
  }

  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    throw new AuthError("Too many attempts. Request a new OTP.", "OTP_LOCKED");
  }

  const isValid = await verifyToken(otp, otpRecord.hashedOtp);

  if (!isValid) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new AuthError("Invalid OTP", "OTP_INVALID");
  }

  otpRecord.usedAt = new Date();
  await otpRecord.save();

  const employee = await Employee.findOne({
    applicationRef: normalizedRef,
    email: normalizedEmail,
  });

  if (!employee) {
    throw new AuthError("Application not found", "NOT_FOUND");
  }

  const token = await createEmployeeSession({
    employeeId: employee._id.toString(),
    applicationRef: employee.applicationRef,
    email: employee.email,
  });

  await setEmployeeSessionCookie(token);

  const editableStatuses = [
    EmployeeStatus.DRAFT,
    EmployeeStatus.L1_RETURNED,
    EmployeeStatus.L2_RETURNED,
  ];

  const redirectTo = editableStatuses.includes(employee.status)
    ? `/onboarding/${employee.applicationRef}`
    : `/application`;

  return { redirectTo };
}

export async function requestPasswordReset(email: string): Promise<void> {
  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail, isActive: true });

  // Always succeed silently to prevent email enumeration
  if (!user) return;

  const resetToken = await createPasswordResetToken(
    user._id.toString(),
    user.email
  );

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const resetUrl = `${getBaseUrl()}/staff/reset-password?token=${resetToken}`;

  if (process.env.NODE_ENV === "development") {
    console.info(`[DEV Reset URL] ${resetUrl}`);
  }
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  await connectDB();

  const payload = await verifyPasswordResetToken(token);
  if (!payload) {
    throw new AuthError("Invalid or expired reset link", "TOKEN_INVALID");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    _id: payload.userId,
    email: payload.email,
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
    isActive: true,
  });

  if (!user) {
    throw new AuthError("Invalid or expired reset link", "TOKEN_INVALID");
  }

  if (newPassword.length < 8) {
    throw new AuthError(
      "Password must be at least 8 characters",
      "WEAK_PASSWORD"
    );
  }

  user.passwordHash = await hashPassword(newPassword);
  user.passwordChangedAt = new Date();
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.failedLoginAttempts = 0;
  user.lockedUntil = undefined;
  await user.save();
}

export async function logoutEmployee(): Promise<void> {
  const { clearEmployeeSessionCookie } = await import(
    "@/lib/auth/employee-session"
  );
  await clearEmployeeSessionCookie();
}
