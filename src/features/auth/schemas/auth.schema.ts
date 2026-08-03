import { z } from "zod";
import { STAFF_ROLES } from "@/types/enums";

export const staffLoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(STAFF_ROLES, {
    required_error: "Please select your role",
    invalid_type_error: "Please select a valid role",
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const employeeLoginSchema = z.object({
  applicationRef: z
    .string()
    .min(1, "Application reference is required")
    .regex(
      /^RS-APP-\d{8}-[A-Z0-9]{4}$/i,
      "Invalid reference format (e.g. RS-APP-20260704-A1B2)"
    ),
  email: z.string().email("Enter a valid email address"),
});

export const employeeOtpSchema = z.object({
  applicationRef: z.string().min(1),
  email: z.string().email(),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
});

export type StaffLoginInput = z.infer<typeof staffLoginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type EmployeeLoginInput = z.infer<typeof employeeLoginSchema>;
export type EmployeeOtpInput = z.infer<typeof employeeOtpSchema>;
