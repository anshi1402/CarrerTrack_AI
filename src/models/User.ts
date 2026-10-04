import mongoose, { Schema, Document } from 'mongoose';
import { User as UserType } from '@/types';

export interface UserDocument extends Omit<UserType, 'id'>, Document {
  id: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    targetRole: { type: String, required: true, default: 'Frontend Developer' },
    skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    dailyGoalTarget: { type: Number, default: 3 },
    reminderTime: { type: String, default: '20:00' },
    notificationPreferences: {
      dailyGoalReminder: { type: Boolean, default: true },
      streakReminder: { type: Boolean, default: true },
      achievementNotifications: { type: Boolean, default: true },
      weeklyProgressSummary: { type: Boolean, default: true },
      browserNotifications: { type: Boolean, default: false },
      reminderTime: { type: String, default: '20:00' },
    },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastLearningDate: { type: String },
    readinessScore: { type: Number, default: 0 },
    completedTopicsCount: { type: Number, default: 0 },
    completedProjectsCount: { type: Number, default: 0 },
    onboardingCompleted: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
