import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { dbRepo } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { notificationId } = body;

    dbRepo.markNotificationAsRead(user.id, notificationId);

    const notifications = dbRepo.getNotifications(user.id);
    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to mark notifications read' }, { status: 500 });
  }
}
