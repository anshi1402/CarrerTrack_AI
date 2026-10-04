import mongoose, { Schema, Document } from 'mongoose';
import { UserProgressItem } from '@/types';

export interface ProgressDocument extends Omit<UserProgressItem, 'id'>, Document {
  id: string;
}

const ProgressSchema = new Schema<ProgressDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    role: { type: String, required: true, index: true },
    topicId: { type: String, required: true, index: true },
    sectionId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: String },
  },
  {
    timestamps: true,
  }
);

ProgressSchema.index({ userId: 1, role: 1, topicId: 1 }, { unique: true });

export const ProgressModel =
  mongoose.models.Progress || mongoose.model<ProgressDocument>('Progress', ProgressSchema);
