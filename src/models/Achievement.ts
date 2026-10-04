import mongoose, { Schema, Document } from 'mongoose';
import { AchievementBadge } from '@/types';

export interface AchievementDocument extends Document {
  userId: string;
  achievements: AchievementBadge[];
}

const BadgeSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    category: {
      type: String,
      enum: ['streak', 'topics', 'readiness', 'projects', 'special'],
      default: 'topics',
    },
    requiredCount: { type: Number, required: true },
    unlocked: { type: Boolean, default: false },
    unlockedAt: { type: String },
    progress: { type: Number, default: 0 },
  },
  { _id: false }
);

const AchievementSchema = new Schema<AchievementDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    achievements: [BadgeSchema],
  },
  {
    timestamps: true,
  }
);

export const AchievementModel =
  mongoose.models.Achievement ||
  mongoose.model<AchievementDocument>('Achievement', AchievementSchema);
