import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { dbRepo } from '@/lib/db';
import { calculatePlacementReadiness } from '@/lib/readiness';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roadmap = await dbRepo.getRoadmapByRole(user.targetRole);
    const progress = await dbRepo.getUserProgress(user.id, user.targetRole);
    const achievements = await dbRepo.getAchievements(user.id);
    const todayGoal = await dbRepo.getDailyGoal(user.id);

    const readinessReport = roadmap
      ? calculatePlacementReadiness(user, roadmap, progress, [todayGoal])
      : null;

    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
      achievements,
      readinessReport,
      totalCompletedTopics: progress.filter((p) => p.completed).length,
      totalRoadmapTopics: roadmap?.totalTopicsCount || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch profile' }, { status: 500 });
  }
}
