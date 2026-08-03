import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtpToken extends Document {
  _id: mongoose.Types.ObjectId;
  applicationRef: string;
  email: string;
  hashedOtp: string;
  purpose: "STATUS_ACCESS" | "FORM_ACCESS";
  expiresAt: Date;
  usedAt?: Date;
  attempts: number;
  createdAt: Date;
}

const OtpTokenSchema = new Schema<IOtpToken>(
  {
    applicationRef: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    hashedOtp: { type: String, required: true },
    purpose: {
      type: String,
      enum: ["STATUS_ACCESS", "FORM_ACCESS"],
      default: "FORM_ACCESS",
    },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

OtpTokenSchema.index({ applicationRef: 1, email: 1 });
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpToken: Model<IOtpToken> =
  mongoose.models.OtpToken ??
  mongoose.model<IOtpToken>("OtpToken", OtpTokenSchema);
