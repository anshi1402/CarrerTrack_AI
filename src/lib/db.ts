import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import {
  User,
  Roadmap,
  UserProgressItem,
  DailyGoal,
  LearningActivityDay,
  UserNotification,
  AchievementBadge,
  TargetRole,
} from '@/types';
import { INITIAL_ROADMAPS, INITIAL_ACHIEVEMENTS } from './seed-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface LocalDatabase {
  users: User[];
  roadmaps: Roadmap[];
  progress: UserProgressItem[];
  dailyGoals: DailyGoal[];
  activities: { userId: string; activities: LearningActivityDay[] }[];
  notifications: UserNotification[];
  achievements: { userId: string; achievements: AchievementBadge[] }[];
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialDB(): LocalDatabase {
  return {
    users: [
      {
        id: 'demo-user-id',
        name: 'Anshi',
        email: 'anshi@careertrack.ai',
        password: '$2a$10$w4r19mEwzHj07uX.0/d9oecmFzH.w4wG8.E4e2r7xM7N5jY7R9pFe', // Demo@123
        targetRole: 'Frontend Developer',
        skillLevel: 'Intermediate',
        dailyGoalTarget: 4,
        reminderTime: '20:00',
        notificationPreferences: {
          dailyGoalReminder: true,
          streakReminder: true,
          achievementNotifications: true,
          weeklyProgressSummary: true,
          browserNotifications: true,
          reminderTime: '20:00',
        },
        currentStreak: 12,
        longestStreak: 15,
        lastLearningDate: new Date().toISOString().split('T')[0],
        readinessScore: 74,
        completedTopicsCount: 28,
        completedProjectsCount: 2,
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
      },
    ],
    roadmaps: INITIAL_ROADMAPS,
    progress: [
      // Pre-populate some demo progress
      { id: 'p-1', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-1-1', sectionId: 'fe-sec-1', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-2', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-1-2', sectionId: 'fe-sec-1', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-3', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-1-3', sectionId: 'fe-sec-1', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-4', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-1-4', sectionId: 'fe-sec-1', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-5', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-1-5', sectionId: 'fe-sec-1', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-6', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-1-6', sectionId: 'fe-sec-1', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-7', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-2-1', sectionId: 'fe-sec-2', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-8', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-2-2', sectionId: 'fe-sec-2', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-9', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-2-3', sectionId: 'fe-sec-2', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-10', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-2-4', sectionId: 'fe-sec-2', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-11', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-2-5', sectionId: 'fe-sec-2', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-12', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-2-6', sectionId: 'fe-sec-2', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-13', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-2-7', sectionId: 'fe-sec-2', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-14', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-3-1', sectionId: 'fe-sec-3', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-15', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-3-2', sectionId: 'fe-sec-3', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-16', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-3-4', sectionId: 'fe-sec-3', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-17', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-3-7', sectionId: 'fe-sec-3', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-18', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-4-1', sectionId: 'fe-sec-4', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-19', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-4-2', sectionId: 'fe-sec-4', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-20', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-4-6', sectionId: 'fe-sec-4', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-21', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-4-8', sectionId: 'fe-sec-4', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-22', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-4-10', sectionId: 'fe-sec-4', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-23', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-5-1', sectionId: 'fe-sec-5', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-24', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-5-2', sectionId: 'fe-sec-5', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-25', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-6-1', sectionId: 'fe-sec-6', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-26', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-6-2', sectionId: 'fe-sec-6', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-27', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-8-1', sectionId: 'fe-sec-8', completed: true, completedAt: new Date().toISOString() },
      { id: 'p-28', userId: 'demo-user-id', role: 'Frontend Developer', topicId: 'fe-8-2', sectionId: 'fe-sec-8', completed: true, completedAt: new Date().toISOString() },
    ],
    dailyGoals: [
      {
        id: 'dg-demo',
        userId: 'demo-user-id',
        date: new Date().toISOString().split('T')[0],
        tasks: [
          { id: 't-1', topicId: 'fe-4-6', sectionId: 'fe-sec-4', title: 'JavaScript — Functions', completed: true },
          { id: 't-2', topicId: 'fe-4-8', sectionId: 'fe-sec-4', title: 'JavaScript — Arrays & Methods', completed: true },
          { id: 't-3', topicId: 'fe-6-2', sectionId: 'fe-sec-6', title: 'React — Functional Components', completed: true },
          { id: 't-4', topicId: 'fe-6-9', sectionId: 'fe-sec-6', title: 'React — useState Hook', completed: false },
        ],
        completedTasksCount: 3,
        totalTasksCount: 4,
        completed: false,
        completionPercentage: 75,
      },
    ],
    activities: [
      {
        userId: 'demo-user-id',
        activities: [
          { date: '2026-09-01', dayOfWeek: 'Tue', topicsCompleted: 3, goalsCompleted: 1, studyMinutes: 120 },
          { date: '2026-09-02', dayOfWeek: 'Wed', topicsCompleted: 4, goalsCompleted: 1, studyMinutes: 150 },
          { date: '2026-09-03', dayOfWeek: 'Thu', topicsCompleted: 2, goalsCompleted: 1, studyMinutes: 90 },
          { date: '2026-09-04', dayOfWeek: 'Fri', topicsCompleted: 5, goalsCompleted: 1, studyMinutes: 180 },
          { date: '2026-09-05', dayOfWeek: 'Sat', topicsCompleted: 4, goalsCompleted: 1, studyMinutes: 160 },
          { date: '2026-09-06', dayOfWeek: 'Sun', topicsCompleted: 3, goalsCompleted: 1, studyMinutes: 110 },
          { date: '2026-09-07', dayOfWeek: 'Mon', topicsCompleted: 3, goalsCompleted: 0, studyMinutes: 105 },
        ],
      },
    ],
    notifications: [
      {
        id: 'notif-1',
        userId: 'demo-user-id',
        type: 'daily_reminder',
        title: 'Daily Goal Reminder',
        message: '📚 You have 1 task left for today. Complete it to keep your 12-day streak alive!',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        userId: 'demo-user-id',
        type: 'milestone',
        title: 'Milestone Unlocked!',
        message: '🏆 Congratulations! You completed 25 roadmap topics in Frontend Developer.',
        read: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'notif-3',
        userId: 'demo-user-id',
        type: 'goal_completed',
        title: 'Streak Continued!',
        message: '🔥 Yesterday\'s daily goal was completed! 12-day streak achieved.',
        read: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    achievements: [
      {
        userId: 'demo-user-id',
        achievements: INITIAL_ACHIEVEMENTS.map((a) => {
          let unlocked = false;
          let progress = 0;
          if (a.id === 'first_topic') { unlocked = true; progress = 100; }
          if (a.id === 'streak_3') { unlocked = true; progress = 100; }
          if (a.id === 'streak_7') { unlocked = true; progress = 100; }
          if (a.id === 'streak_30') { unlocked = false; progress = 40; }
          if (a.id === 'topics_10') { unlocked = true; progress = 100; }
          if (a.id === 'topics_25') { unlocked = true; progress = 100; }
          if (a.id === 'topics_50') { unlocked = false; progress = 56; }
          if (a.id === 'first_project') { unlocked = true; progress = 100; }
          if (a.id === 'readiness_50') { unlocked = true; progress = 100; }
          if (a.id === 'readiness_80') { unlocked = false; progress = 92; }
          return { ...a, unlocked, progress };
        }),
      },
    ],
  };
}

export function readDB(): LocalDatabase {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const init = getInitialDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2), 'utf-8');
    return init;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const init = getInitialDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2), 'utf-8');
    return init;
  }
}

export function writeDB(db: LocalDatabase) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// Database Repository API
export const dbRepo = {
  getUserById(id: string): User | undefined {
    const db = readDB();
    return db.users.find((u) => u.id === id);
  },

  getUserByEmail(email: string): User | undefined {
    const db = readDB();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  createUser(user: User): User {
    const db = readDB();
    db.users.push(user);
    // Initialize achievements
    db.achievements.push({
      userId: user.id,
      achievements: INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, progress: 0 })),
    });
    // Initialize welcome notification
    db.notifications.push({
      id: 'notif-' + Date.now(),
      userId: user.id,
      type: 'welcome',
      title: 'Welcome to CareerTrack AI! 🎉',
      message: `Your learning roadmap for ${user.targetRole} has been generated. Let's start your journey!`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    writeDB(db);
    return user;
  },

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const db = readDB();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    db.users[idx] = { ...db.users[idx], ...updates };
    writeDB(db);
    return db.users[idx];
  },

  getAllRoadmaps(): Roadmap[] {
    const db = readDB();
    return db.roadmaps && db.roadmaps.length > 0 ? db.roadmaps : INITIAL_ROADMAPS;
  },

  getRoadmapByRole(role: TargetRole | string): Roadmap | undefined {
    const db = readDB();
    return db.roadmaps.find((r) => r.role.toLowerCase() === role.toLowerCase() || r.slug.toLowerCase() === role.toLowerCase());
  },

  getUserProgress(userId: string, role?: TargetRole): UserProgressItem[] {
    const db = readDB();
    return db.progress.filter((p) => p.userId === userId && (!role || p.role === role));
  },

  toggleProgress(userId: string, role: TargetRole, topicId: string, sectionId: string): { completed: boolean; allProgress: UserProgressItem[] } {
    const db = readDB();
    const existingIdx = db.progress.findIndex(
      (p) => p.userId === userId && p.role === role && p.topicId === topicId
    );

    let isCompleted = false;
    if (existingIdx >= 0) {
      isCompleted = !db.progress[existingIdx].completed;
      db.progress[existingIdx].completed = isCompleted;
      db.progress[existingIdx].completedAt = isCompleted ? new Date().toISOString() : undefined;
    } else {
      isCompleted = true;
      db.progress.push({
        id: 'p-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        userId,
        role,
        topicId,
        sectionId,
        completed: true,
        completedAt: new Date().toISOString(),
      });
    }

    // Auto-update today's daily goal if topic is in daily goals
    const today = new Date().toISOString().split('T')[0];
    const userGoal = db.dailyGoals.find((g) => g.userId === userId && g.date === today);
    if (userGoal) {
      const task = userGoal.tasks.find((t) => t.topicId === topicId);
      if (task) {
        task.completed = isCompleted;
        task.completedAt = isCompleted ? new Date().toISOString() : undefined;
        userGoal.completedTasksCount = userGoal.tasks.filter((t) => t.completed).length;
        userGoal.completionPercentage = Math.round((userGoal.completedTasksCount / (userGoal.totalTasksCount || 1)) * 100);
        userGoal.completed = userGoal.completedTasksCount >= userGoal.totalTasksCount;
      }
    }

    writeDB(db);
    return {
      completed: isCompleted,
      allProgress: db.progress.filter((p) => p.userId === userId && p.role === role),
    };
  },

  getDailyGoal(userId: string, dateStr?: string): DailyGoal {
    const db = readDB();
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    let goal = db.dailyGoals.find((g) => g.userId === userId && g.date === targetDate);

    if (!goal) {
      // Create a default daily goal based on target user roadmaps
      const user = db.users.find((u) => u.id === userId);
      const targetRole = user ? user.targetRole : 'Frontend Developer';
      const userProgress = db.progress.filter((p) => p.userId === userId && p.role === targetRole && p.completed);
      const completedIds = new Set(userProgress.map((p) => p.topicId));

      const roadmap = db.roadmaps.find((r) => r.role === targetRole) || INITIAL_ROADMAPS[0];
      const allTopics = roadmap.sections.flatMap((s) => s.topics.map((t) => ({ ...t, sectionId: s.id })));
      const nextTopics = allTopics.filter((t) => !completedIds.has(t.id)).slice(0, user?.dailyGoalTarget || 3);

      goal = {
        id: 'dg-' + Date.now(),
        userId,
        date: targetDate,
        tasks: nextTopics.map((nt) => ({
          id: 'task-' + nt.id,
          topicId: nt.id,
          sectionId: nt.sectionId,
          title: nt.title,
          role: targetRole,
          completed: false,
        })),
        completedTasksCount: 0,
        totalTasksCount: nextTopics.length || 3,
        completed: false,
        completionPercentage: 0,
      };

      db.dailyGoals.push(goal);
      writeDB(db);
    }

    return goal;
  },

  saveDailyGoal(goal: DailyGoal): DailyGoal {
    const db = readDB();
    const idx = db.dailyGoals.findIndex((g) => g.id === goal.id || (g.userId === goal.userId && g.date === goal.date));
    if (idx >= 0) {
      db.dailyGoals[idx] = goal;
    } else {
      db.dailyGoals.push(goal);
    }
    writeDB(db);
    return goal;
  },

  getActivities(userId: string): LearningActivityDay[] {
    const db = readDB();
    const userActs = db.activities.find((a) => a.userId === userId);
    if (userActs) return userActs.activities;

    // Generate recent 7 days default
    const days: LearningActivityDay[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayOfWeek: dayNames[d.getDay()],
        topicsCompleted: i === 0 ? 3 : Math.floor(Math.random() * 4) + 1,
        goalsCompleted: i === 0 ? 0 : 1,
        studyMinutes: Math.floor(Math.random() * 90) + 45,
      });
    }
    db.activities.push({ userId, activities: days });
    writeDB(db);
    return days;
  },

  getNotifications(userId: string): UserNotification[] {
    const db = readDB();
    return db.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addNotification(notification: UserNotification): UserNotification {
    const db = readDB();
    db.notifications.unshift(notification);
    writeDB(db);
    return notification;
  },

  markNotificationAsRead(userId: string, notificationId?: string): void {
    const db = readDB();
    db.notifications.forEach((n) => {
      if (n.userId === userId && (!notificationId || n.id === notificationId)) {
        n.read = true;
      }
    });
    writeDB(db);
  },

  getAchievements(userId: string): AchievementBadge[] {
    const db = readDB();
    const record = db.achievements.find((a) => a.userId === userId);
    return record ? record.achievements : INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, progress: 0 }));
  },

  updateAchievements(userId: string, achievements: AchievementBadge[]) {
    const db = readDB();
    const idx = db.achievements.findIndex((a) => a.userId === userId);
    if (idx >= 0) {
      db.achievements[idx].achievements = achievements;
    } else {
      db.achievements.push({ userId, achievements });
    }
    writeDB(db);
  },
};
