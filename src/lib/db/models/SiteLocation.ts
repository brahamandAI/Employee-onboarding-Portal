import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteLocation extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  code: string;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  contactPerson?: string;
  contactPhone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SiteLocationSchema = new Schema<ISiteLocation>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SiteLocation: Model<ISiteLocation> =
  mongoose.models.SiteLocation ??
  mongoose.model<ISiteLocation>("SiteLocation", SiteLocationSchema);
