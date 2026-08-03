import mongoose, { Schema, Document, Model } from "mongoose";

export type IdCardRecordStatus = "GENERATED" | "COMPLETED" | "REVOKED" | "SUPERSEDED";

export interface IIdCard extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  employeeIdCode: string;
  employeeName: string;
  photoUrl?: string;
  designation?: string;
  department?: string;
  branch?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  address?: string;
  qrCodeUrl?: string;
  issueDate: Date;
  expiryDate: Date;
  /** Cloudinary secure URL for downloadable ID card PDF */
  url: string;
  downloadUrl?: string;
  format: "PDF" | "PNG";
  status: "ACTIVE" | "SUPERSEDED" | "REVOKED";
  cardStatus: IdCardRecordStatus;
  generatedBy?: mongoose.Types.ObjectId;
  completedAt?: Date;
  completedBy?: mongoose.Types.ObjectId;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IdCardSchema = new Schema<IIdCard>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    employeeIdCode: { type: String, required: true, index: true },
    employeeName: { type: String, required: true },
    photoUrl: { type: String },
    designation: { type: String },
    department: { type: String },
    branch: { type: String },
    bloodGroup: { type: String },
    dateOfBirth: { type: String },
    address: { type: String },
    qrCodeUrl: { type: String },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    url: { type: String, required: true },
    downloadUrl: { type: String },
    format: { type: String, enum: ["PDF", "PNG"], default: "PDF" },
    status: {
      type: String,
      enum: ["ACTIVE", "SUPERSEDED", "REVOKED"],
      default: "ACTIVE",
    },
    cardStatus: {
      type: String,
      enum: ["GENERATED", "COMPLETED", "REVOKED", "SUPERSEDED"],
      default: "GENERATED",
    },
    generatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    completedAt: { type: Date },
    completedBy: { type: Schema.Types.ObjectId, ref: "User" },
    generatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "employee_id_cards",
  }
);

IdCardSchema.index(
  { employeeId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "ACTIVE" } }
);

export const IdCard: Model<IIdCard> =
  mongoose.models.IdCard ?? mongoose.model<IIdCard>("IdCard", IdCardSchema);
