import mongoose, { Schema, Document, Model } from "mongoose";
import { NotificationType } from "@/features/notifications/constants";

export type NotificationRecipientType = "STAFF" | "EMPLOYEE";

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  recipientType: NotificationRecipientType;
  recipientId: mongoose.Types.ObjectId;
  employeeId?: mongoose.Types.ObjectId;
  applicationRef?: string;
  type: NotificationType;
  title: string;
  body: string;
  linkUrl?: string;
  readAt?: Date;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientType: {
      type: String,
      enum: ["STAFF", "EMPLOYEE"],
      required: true,
      default: "STAFF",
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee" },
    applicationRef: { type: String },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    linkUrl: { type: String },
    readAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

NotificationSchema.index({ recipientType: 1, recipientId: 1, readAt: 1, createdAt: -1 });
NotificationSchema.index({ recipientType: 1, recipientId: 1, createdAt: -1 });

export const Notification: Model<INotification> =
  mongoose.models.Notification ??
  mongoose.model<INotification>("Notification", NotificationSchema);
