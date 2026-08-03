import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDesignation extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  code: string;
  departmentId?: mongoose.Types.ObjectId;
  level?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DesignationSchema = new Schema<IDesignation>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
    level: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Designation: Model<IDesignation> =
  mongoose.models.Designation ??
  mongoose.model<IDesignation>("Designation", DesignationSchema);
