import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { AuditLog } from "@/lib/db/models/AuditLog";
import { toClientProps } from "@/lib/serialize/client-props";

export async function logAudit(params: {
  action: string;
  entity: string;
  entityId?: string;
  performedBy: string;
  performedByName: string;
  performedByRole: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  await connectDB();
  await AuditLog.create({
    action: params.action,
    entity: params.entity,
    entityId: params.entityId,
    performedBy: new mongoose.Types.ObjectId(params.performedBy),
    performedByName: params.performedByName,
    performedByRole: params.performedByRole,
    details: params.details,
  });
}

export interface AuditLogItem {
  _id: string;
  action: string;
  entity: string;
  entityId?: string;
  performedByName: string;
  performedByRole: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export async function getAuditLogs(limit = 100): Promise<AuditLogItem[]> {
  await connectDB();
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit).lean();
  return logs.map((l) =>
    toClientProps({
      _id: String(l._id),
      action: l.action,
      entity: l.entity,
      entityId: l.entityId,
      performedByName: l.performedByName,
      performedByRole: l.performedByRole,
      details: l.details as Record<string, unknown> | undefined,
      createdAt: l.createdAt.toISOString(),
    })
  );
}
