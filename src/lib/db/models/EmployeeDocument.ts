import mongoose, { Schema, Document, Model } from "mongoose";
import { DocumentType } from "@/features/onboarding/constants";

export interface IEmployeeDocument extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  documentType: DocumentType;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  /** Cloudinary secure HTTPS URL — sole file reference stored in MongoDB */
  url: string;
  version: number;
  isActive: boolean;
  uploadedBy: "EMPLOYEE" | "SUPPORT";
  /** Relative path inside employee folder, e.g. "Employee Photo/photo.jpg" */
  folderRelativePath?: string;
  /** Human label for folder display */
  folderLabel?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeDocumentSchema = new Schema<IEmployeeDocument>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    documentType: {
      type: String,
      enum: Object.values(DocumentType),
      required: true,
    },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    url: { type: String, required: true },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    uploadedBy: {
      type: String,
      enum: ["EMPLOYEE", "SUPPORT"],
      default: "EMPLOYEE",
    },
    folderRelativePath: { type: String },
    folderLabel: { type: String },
  },
  { timestamps: true }
);

EmployeeDocumentSchema.index(
  { employeeId: 1, documentType: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

EmployeeDocumentSchema.index({ url: 1 });

export const EmployeeDocument: Model<IEmployeeDocument> =
  mongoose.models.EmployeeDocument ??
  mongoose.model<IEmployeeDocument>("EmployeeDocument", EmployeeDocumentSchema);
