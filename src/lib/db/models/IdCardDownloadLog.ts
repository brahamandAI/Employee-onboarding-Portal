import mongoose, { Schema, Document, Model } from "mongoose";

export type IdCardDownloadAction = "PREVIEW" | "DOWNLOAD" | "GENERATE" | "COMPLETE";

export interface IIdCardDownloadLog extends Document {
  _id: mongoose.Types.ObjectId;
  idCardId?: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  employeeIdCode: string;
  employeeName: string;
  action: IdCardDownloadAction;
  performedBy: mongoose.Types.ObjectId;
  performedByRole: string;
  createdAt: Date;
}

const IdCardDownloadLogSchema = new Schema<IIdCardDownloadLog>(
  {
    idCardId: { type: Schema.Types.ObjectId, ref: "IdCard" },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    employeeIdCode: { type: String, required: true },
    employeeName: { type: String, required: true },
    action: {
      type: String,
      enum: ["PREVIEW", "DOWNLOAD", "GENERATE", "COMPLETE"],
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performedByRole: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

IdCardDownloadLogSchema.index({ createdAt: -1 });
IdCardDownloadLogSchema.index({ performedBy: 1, createdAt: -1 });

export const IdCardDownloadLog: Model<IIdCardDownloadLog> =
  mongoose.models.IdCardDownloadLog ??
  mongoose.model<IIdCardDownloadLog>("IdCardDownloadLog", IdCardDownloadLogSchema);
