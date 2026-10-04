import mongoose, { Schema, Document } from 'mongoose';
import { DailyGoal as DailyGoalType } from '@/types';

export interface DailyGoalDocument extends Omit<DailyGoalType, 'id'>, Document {
  id: string;
}

const DailyGoalTaskSchema = new Schema(
  {
    id: { type: String, required: true },
    topicId: { type: String },
    sectionId: { type: String },
    title: { type: String, required: true },
    role: { type: String },
    completed: { type: Boolean, default: false },
    completedAt: { type: String },
  },
  { _id: false }
);

const DailyGoalSchema = new Schema<DailyGoalDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    tasks: [DailyGoalTaskSchema],
    completedTasksCount: { type: Number, default: 0 },
    totalTasksCount: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    completionPercentage: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

DailyGoalSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyGoalModel =
  mongoose.models.DailyGoal || mongoose.model<DailyGoalDocument>('DailyGoal', DailyGoalSchema);
