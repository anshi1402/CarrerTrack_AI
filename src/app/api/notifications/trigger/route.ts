import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { dbRepo } from '@/lib/db';
import { triggerStreakRiskNotification } from '@/lib/notifications';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type } = body;

    if (type === 'streak_risk') {
      await triggerStreakRiskNotification(user.id);
    } else {
      await dbRepo.addNotification({
        id: 'notif-' + Date.now(),
        userId: user.id,
        type: 'daily_reminder',
        title: 'Daily Goal Reminder ⏰',
        message: `📚 Friendly reminder: Finish your ${user.dailyGoalTarget} daily tasks to keep your ${user.currentStreak}-day learning streak alive!`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    const notifications = await dbRepo.getNotifications(user.id);
    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      success: true,
      message: 'Test notification triggered',
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to trigger notification' }, { status: 500 });
  }
}
