import mongoose, { Schema, Document } from 'mongoose';
import { LearningActivityDay } from '@/types';

export interface ActivityDocument extends Document {
  userId: string;
  activities: LearningActivityDay[];
}

const ActivityDaySchema = new Schema(
  {
    date: { type: String, required: true },
    dayOfWeek: { type: String, required: true },
    topicsCompleted: { type: Number, default: 0 },
    goalsCompleted: { type: Number, default: 0 },
    studyMinutes: { type: Number, default: 0 },
  },
  { _id: false }
);

const ActivitySchema = new Schema<ActivityDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    activities: [ActivityDaySchema],
  },
  {
    timestamps: true,
  }
);

export const ActivityModel =
  mongoose.models.Activity || mongoose.model<ActivityDocument>('Activity', ActivitySchema);
