import { z } from "zod";

export const l1RejectSchema = z.object({
  employeeId: z.string().min(1),
  comment: z.string().min(10, "Reason must be at least 10 characters"),
});

export const l1ReturnSchema = z.object({
  employeeId: z.string().min(1),
  comment: z.string().min(10, "Correction notes must be at least 10 characters"),
});

export const l1ApproveSchema = z.object({
  employeeId: z.string().min(1),
  approvedByName: z
    .string()
    .trim()
    .min(2, "Enter the L1 name in Approved by")
    .max(80, "Approved by name is too long"),
  comment: z.string().optional(),
});
