import { User, DailyGoal } from '@/types';
import { dbRepo } from './db';

export function evaluateAndUpdateStreak(userId: string, todayGoal: DailyGoal): { currentStreak: number; longestStreak: number; streakIncreased: boolean } {
  const user = dbRepo.getUserById(userId);
  if (!user) return { currentStreak: 0, longestStreak: 0, streakIncreased: false };

  const todayStr = new Date().toISOString().split('T')[0];
  const lastLearning = user.lastLearningDate;

  let currentStreak = user.currentStreak || 0;
  let longestStreak = user.longestStreak || 0;
  let streakIncreased = false;

  if (todayGoal.completed) {
    if (lastLearning !== todayStr) {
      // If completed yesterday or first time, increment
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastLearning === yesterdayStr || currentStreak === 0) {
        currentStreak += 1;
      } else {
        // Gap of more than 1 day
        currentStreak = 1;
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      streakIncreased = true;
      dbRepo.updateUser(userId, {
        currentStreak,
        longestStreak,
        lastLearningDate: todayStr,
      });

      // Add achievement or notification if milestone
      if (currentStreak === 3 || currentStreak === 7 || currentStreak === 30) {
        dbRepo.addNotification({
          id: 'notif-' + Date.now(),
          userId,
          type: 'milestone',
          title: `🔥 ${currentStreak}-Day Streak Achieved!`,
          message: `Incredible dedication! You have maintained a ${currentStreak}-day learning streak. Keep the momentum going!`,
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  return { currentStreak, longestStreak, streakIncreased };
}

export { getStreakMessage } from './streak-utils';
