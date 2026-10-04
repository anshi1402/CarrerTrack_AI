import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { dbRepo } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      settings: {
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        skillLevel: user.skillLevel,
        dailyGoalTarget: user.dailyGoalTarget,
        reminderTime: user.reminderTime,
        notificationPreferences: user.notificationPreferences,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      dailyGoalTarget,
      reminderTime,
      notificationPreferences,
    } = body;

    const updatedUser = await dbRepo.updateUser(user.id, {
      ...(name && { name }),
      ...(dailyGoalTarget && { dailyGoalTarget: Number(dailyGoalTarget) }),
      ...(reminderTime && { reminderTime }),
      ...(notificationPreferences && {
        notificationPreferences: {
          ...user.notificationPreferences,
          ...notificationPreferences,
        },
      }),
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Settings updated successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
