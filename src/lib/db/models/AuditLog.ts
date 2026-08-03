import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
  _id: mongoose.Types.ObjectId;
  action: string;
  entity: string;
  entityId?: string;
  performedBy: mongoose.Types.ObjectId;
  performedByName: string;
  performedByRole: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: String },
    performedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    performedByName: { type: String, required: true },
    performedByRole: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ??
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
