import mongoose, { Schema, Document } from 'mongoose';
import { UserNotification as NotificationType } from '@/types';

export interface NotificationDocument extends Omit<NotificationType, 'id'>, Document {
  id: string;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['daily_reminder', 'streak_risk', 'goal_completed', 'milestone', 'welcome'],
      default: 'daily_reminder',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
    icon: { type: String },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });

export const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model<NotificationDocument>('Notification', NotificationSchema);
