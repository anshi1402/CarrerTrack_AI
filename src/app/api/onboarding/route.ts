import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { dbRepo } from '@/lib/db';
import { TargetRole, SkillLevel } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, targetRole, skillLevel, dailyGoalTarget, reminderTime } = body;

    const updated = dbRepo.updateUser(user.id, {
      ...(name && { name }),
      targetRole: (targetRole as TargetRole) || user.targetRole,
      skillLevel: (skillLevel as SkillLevel) || user.skillLevel,
      dailyGoalTarget: Number(dailyGoalTarget) || 3,
      reminderTime: reminderTime || '20:00',
      notificationPreferences: {
        ...user.notificationPreferences,
        reminderTime: reminderTime || '20:00',
      },
      onboardingCompleted: true,
    });

    const roadmap = dbRepo.getRoadmapByRole(updated?.targetRole || 'Frontend Developer');

    return NextResponse.json({
      success: true,
      user: updated,
      roadmap,
      message: 'Onboarding completed successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Onboarding update failed' }, { status: 500 });
  }
}
