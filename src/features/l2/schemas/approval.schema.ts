import { z } from "zod";

export const l2RejectSchema = z.object({
  employeeId: z.string().min(1),
  comment: z.string().min(10, "Reason must be at least 10 characters"),
});

export const l2ReturnSchema = z.object({
  employeeId: z.string().min(1),
  comment: z.string().min(10, "Send-back notes must be at least 10 characters"),
});

export const l2ReturnToL1Schema = z.object({
  employeeId: z.string().min(1),
  comment: z.string().min(10, "Send-back notes must be at least 10 characters"),
});

export const l2ApproveSchema = z.object({
  employeeId: z.string().min(1),
  comment: z.string().optional(),
});

export const l2ForwardSchema = z.object({
  employeeId: z.string().min(1),
  comment: z.string().optional(),
});
