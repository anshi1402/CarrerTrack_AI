import { dbRepo } from './db';
import { UserNotification } from '@/types';

export function checkAndGenerateDailyReminders(userId: string) {
  const user = dbRepo.getUserById(userId);
  if (!user || !user.notificationPreferences?.dailyGoalReminder) return;

  const today = new Date().toISOString().split('T')[0];
  const goal = dbRepo.getDailyGoal(userId, today);

  if (!goal.completed && goal.tasks.length > 0) {
    const remaining = goal.tasks.filter((t) => !t.completed).length;
    const existingNotif = dbRepo.getNotifications(userId).find(
      (n) => n.type === 'daily_reminder' && n.createdAt.startsWith(today)
    );

    if (!existingNotif && remaining > 0) {
      dbRepo.addNotification({
        id: 'notif-' + Date.now(),
        userId,
        type: 'daily_reminder',
        title: 'Daily Goal Reminder 📚',
        message: `You still have ${remaining} learning ${remaining === 1 ? 'task' : 'tasks'} left today. Keep your ${user.currentStreak}-day streak alive!`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  }
}

export function triggerStreakRiskNotification(userId: string) {
  const user = dbRepo.getUserById(userId);
  if (!user) return;

  dbRepo.addNotification({
    id: 'notif-' + Date.now(),
    userId,
    type: 'streak_risk',
    title: 'Streak at Risk! 🔥',
    message: `Your ${user.currentStreak}-day streak is about to reset tonight! Complete today's daily goal to protect your progress.`,
    read: false,
    createdAt: new Date().toISOString(),
  });
}
