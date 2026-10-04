import fs from 'fs';
import path from 'path';
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
import { connectToDatabase, isMongoConfigured } from './mongodb';
import { UserModel } from '@/models/User';
import { RoadmapModel } from '@/models/Roadmap';
import { ProgressModel } from '@/models/Progress';
import { DailyGoalModel } from '@/models/DailyGoal';
import { ActivityModel } from '@/models/Activity';
import { NotificationModel } from '@/models/Notification';
import { AchievementModel } from '@/models/Achievement';

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

// In-memory fallback if file system is read-only (e.g. serverless)
let memoryDB: LocalDatabase | null = null;

function getInitialDB(): LocalDatabase {
  return {
    users: [],
    roadmaps: INITIAL_ROADMAPS,
    progress: [],
    dailyGoals: [],
    activities: [],
    notifications: [],
    achievements: [],
  };
}

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignore read-only FS errors on serverless platforms
  }
}

export function readDB(): LocalDatabase {
  if (memoryDB) return memoryDB;

  try {
    ensureDataDir();
    if (!fs.existsSync(DB_FILE)) {
      const init = getInitialDB();
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2), 'utf-8');
      } catch {
        // Read-only environment fallback
      }
      memoryDB = init;
      return init;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    memoryDB = JSON.parse(raw);
    if (!memoryDB || !Array.isArray(memoryDB.users)) {
      memoryDB = getInitialDB();
    }
    if (!memoryDB.roadmaps || memoryDB.roadmaps.length === 0) {
      memoryDB.roadmaps = INITIAL_ROADMAPS;
    }
    return memoryDB as LocalDatabase;
  } catch {
    const init = getInitialDB();
    memoryDB = init;
    return init;
  }
}

export function writeDB(db: LocalDatabase) {
  memoryDB = db;
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch {
    // Read-only serverless environment fallback (persists in memory for lifecycle)
  }
}

let isMongoSeeded = false;

async function seedMongoIfEmpty() {
  if (isMongoSeeded) return;
  try {
    const roadmapCount = await RoadmapModel.countDocuments();
    if (roadmapCount === 0) {
      console.log('🌱 Seeding initial curriculum roadmaps into MongoDB Atlas...');
      for (const r of INITIAL_ROADMAPS) {
        await RoadmapModel.findOneAndUpdate({ id: r.id }, r, { upsert: true, new: true });
      }
    }
    isMongoSeeded = true;
  } catch (err) {
    console.error('Error during MongoDB roadmap seeding:', err);
  }
}

// Database Repository API (Dual-Mode: MongoDB Atlas + Local JSON Fallback)
export const dbRepo = {
  async getUserById(id: string): Promise<User | undefined> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        await seedMongoIfEmpty();
        const doc = await UserModel.findOne({ id }).lean();
        if (doc) return doc as unknown as User;
      }
    }
    const db = readDB();
    return db.users.find((u) => u.id === id);
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        await seedMongoIfEmpty();
        const doc = await UserModel.findOne({ email: email.toLowerCase() }).lean();
        if (doc) return doc as unknown as User;
      }
    }
    const db = readDB();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  async createUser(user: User): Promise<User> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        await UserModel.create(user);
        await AchievementModel.create({
          userId: user.id,
          achievements: INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, progress: 0 })),
        });
        await NotificationModel.create({
          id: 'notif-' + Date.now(),
          userId: user.id,
          type: 'welcome',
          title: 'Welcome to CareerTrack AI! 🎉',
          message: `Your learning roadmap for ${user.targetRole} has been generated. Let's start your journey!`,
          read: false,
          createdAt: new Date().toISOString(),
        });
        return user;
      }
    }

    const db = readDB();
    db.users.push(user);
    db.achievements.push({
      userId: user.id,
      achievements: INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, progress: 0 })),
    });
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

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        const updated = await UserModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
        if (updated) return updated as unknown as User;
      }
    }

    const db = readDB();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    db.users[idx] = { ...db.users[idx], ...updates };
    writeDB(db);
    return db.users[idx];
  },

  async getAllRoadmaps(): Promise<Roadmap[]> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        await seedMongoIfEmpty();
        const roadmaps = await RoadmapModel.find({}).lean();
        if (roadmaps && roadmaps.length > 0) return roadmaps as unknown as Roadmap[];
      }
    }

    const db = readDB();
    return db.roadmaps && db.roadmaps.length > 0 ? db.roadmaps : INITIAL_ROADMAPS;
  },

  async getRoadmapByRole(role: TargetRole | string): Promise<Roadmap | undefined> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        await seedMongoIfEmpty();
        const regex = new RegExp(`^${role}$`, 'i');
        const roadmap = await RoadmapModel.findOne({
          $or: [{ role: regex }, { slug: regex }],
        }).lean();
        if (roadmap) return roadmap as unknown as Roadmap;
      }
    }

    const db = readDB();
    return db.roadmaps.find(
      (r) =>
        r.role.toLowerCase() === role.toLowerCase() ||
        r.slug.toLowerCase() === role.toLowerCase()
    );
  },

  async getUserProgress(userId: string, role?: TargetRole): Promise<UserProgressItem[]> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        const query: any = { userId };
        if (role) query.role = role;
        const list = await ProgressModel.find(query).lean();
        return list as unknown as UserProgressItem[];
      }
    }

    const db = readDB();
    return db.progress.filter((p) => p.userId === userId && (!role || p.role === role));
  },

  async toggleProgress(
    userId: string,
    role: TargetRole,
    topicId: string,
    sectionId: string
  ): Promise<{ completed: boolean; allProgress: UserProgressItem[] }> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        const existing = await ProgressModel.findOne({ userId, role, topicId });
        let isCompleted = false;

        if (existing) {
          isCompleted = !existing.completed;
          existing.completed = isCompleted;
          existing.completedAt = isCompleted ? new Date().toISOString() : undefined;
          await existing.save();
        } else {
          isCompleted = true;
          await ProgressModel.create({
            id: 'p-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            userId,
            role,
            topicId,
            sectionId,
            completed: true,
            completedAt: new Date().toISOString(),
          });
        }

        // Auto-update today's daily goal if topic is present
        const today = new Date().toISOString().split('T')[0];
        const userGoal = await DailyGoalModel.findOne({ userId, date: today });
        if (userGoal) {
          const task = userGoal.tasks.find((t: any) => t.topicId === topicId);
          if (task) {
            task.completed = isCompleted;
            task.completedAt = isCompleted ? new Date().toISOString() : undefined;
            userGoal.completedTasksCount = userGoal.tasks.filter((t: any) => t.completed).length;
            userGoal.completionPercentage = Math.round(
              (userGoal.completedTasksCount / (userGoal.totalTasksCount || 1)) * 100
            );
            userGoal.completed = userGoal.completedTasksCount >= userGoal.totalTasksCount;
            await userGoal.save();
          }
        }

        const allProgress = (await ProgressModel.find({ userId, role }).lean()) as unknown as UserProgressItem[];
        return { completed: isCompleted, allProgress };
      }
    }

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

    const today = new Date().toISOString().split('T')[0];
    const userGoal = db.dailyGoals.find((g) => g.userId === userId && g.date === today);
    if (userGoal) {
      const task = userGoal.tasks.find((t) => t.topicId === topicId);
      if (task) {
        task.completed = isCompleted;
        task.completedAt = isCompleted ? new Date().toISOString() : undefined;
        userGoal.completedTasksCount = userGoal.tasks.filter((t) => t.completed).length;
        userGoal.completionPercentage = Math.round(
          (userGoal.completedTasksCount / (userGoal.totalTasksCount || 1)) * 100
        );
        userGoal.completed = userGoal.completedTasksCount >= userGoal.totalTasksCount;
      }
    }

    writeDB(db);
    return {
      completed: isCompleted,
      allProgress: db.progress.filter((p) => p.userId === userId && p.role === role),
    };
  },

  async getDailyGoal(userId: string, dateStr?: string): Promise<DailyGoal> {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];

    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        let goalDoc = await DailyGoalModel.findOne({ userId, date: targetDate }).lean();
        if (!goalDoc) {
          const userDoc = (await UserModel.findOne({ id: userId }).lean()) as unknown as User;
          const targetRole = userDoc ? userDoc.targetRole : 'Frontend Developer';
          const progress = (await ProgressModel.find({ userId, role: targetRole, completed: true }).lean()) as unknown as UserProgressItem[];
          const completedIds = new Set(progress.map((p) => p.topicId));

          const roadmap = ((await RoadmapModel.findOne({ role: targetRole }).lean()) || INITIAL_ROADMAPS[0]) as unknown as Roadmap;
          const allTopics = roadmap.sections.flatMap((s) => s.topics.map((t) => ({ ...t, sectionId: s.id })));
          const nextTopics = allTopics.filter((t) => !completedIds.has(t.id)).slice(0, userDoc?.dailyGoalTarget || 3);

          const newGoal: DailyGoal = {
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

          await DailyGoalModel.create(newGoal);
          return newGoal;
        }
        return goalDoc as unknown as DailyGoal;
      }
    }

    const db = readDB();
    let goal = db.dailyGoals.find((g) => g.userId === userId && g.date === targetDate);

    if (!goal) {
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

  async saveDailyGoal(goal: DailyGoal): Promise<DailyGoal> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        await DailyGoalModel.findOneAndUpdate(
          { id: goal.id },
          goal,
          { upsert: true, new: true }
        );
        return goal;
      }
    }

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

  async getActivities(userId: string): Promise<LearningActivityDay[]> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        const doc = (await ActivityModel.findOne({ userId }).lean()) as { userId: string; activities: LearningActivityDay[] } | null;
        if (doc && doc.activities && doc.activities.length > 0) {
          return doc.activities;
        }

        const days: LearningActivityDay[] = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          days.push({
            date: dateStr,
            dayOfWeek: dayNames[d.getDay()],
            topicsCompleted: 0,
            goalsCompleted: 0,
            studyMinutes: 0,
          });
        }
        await ActivityModel.findOneAndUpdate({ userId }, { userId, activities: days }, { upsert: true });
        return days;
      }
    }

    const db = readDB();
    const userActs = db.activities.find((a) => a.userId === userId);
    if (userActs) return userActs.activities;

    const days: LearningActivityDay[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayOfWeek: dayNames[d.getDay()],
        topicsCompleted: 0,
        goalsCompleted: 0,
        studyMinutes: 0,
      });
    }
    db.activities.push({ userId, activities: days });
    writeDB(db);
    return days;
  },

  async getNotifications(userId: string): Promise<UserNotification[]> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        const notifs = await NotificationModel.find({ userId }).sort({ createdAt: -1 }).lean();
        return notifs as unknown as UserNotification[];
      }
    }

    const db = readDB();
    return db.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addNotification(notification: UserNotification): Promise<UserNotification> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        await NotificationModel.create(notification);
        return notification;
      }
    }

    const db = readDB();
    db.notifications.unshift(notification);
    writeDB(db);
    return notification;
  },

  async markNotificationAsRead(userId: string, notificationId?: string): Promise<void> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        const filter: any = { userId };
        if (notificationId) filter.id = notificationId;
        await NotificationModel.updateMany(filter, { $set: { read: true } });
        return;
      }
    }

    const db = readDB();
    db.notifications.forEach((n) => {
      if (n.userId === userId && (!notificationId || n.id === notificationId)) {
        n.read = true;
      }
    });
    writeDB(db);
  },

  async getAchievements(userId: string): Promise<AchievementBadge[]> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        const record = (await AchievementModel.findOne({ userId }).lean()) as { userId: string; achievements: AchievementBadge[] } | null;
        if (record && record.achievements) return record.achievements;
        return INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, progress: 0 }));
      }
    }

    const db = readDB();
    const record = db.achievements.find((a) => a.userId === userId);
    return record ? record.achievements : INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false, progress: 0 }));
  },

  async updateAchievements(userId: string, achievements: AchievementBadge[]): Promise<void> {
    if (isMongoConfigured()) {
      const conn = await connectToDatabase();
      if (conn) {
        await AchievementModel.findOneAndUpdate(
          { userId },
          { userId, achievements },
          { upsert: true, new: true }
        );
        return;
      }
    }

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
