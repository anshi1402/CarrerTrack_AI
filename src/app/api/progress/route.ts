import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { dbRepo } from '@/lib/db';
import { TargetRole } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get('role') as TargetRole | null;
    const targetRole = roleParam || user.targetRole;

    const progress = dbRepo.getUserProgress(user.id, targetRole);
    const roadmap = dbRepo.getRoadmapByRole(targetRole);

    const totalTopics = roadmap?.totalTopicsCount || 1;
    const completedCount = progress.filter((p) => p.completed).length;
    const completionPercentage = Math.round((completedCount / totalTopics) * 100);

    return NextResponse.json({
      success: true,
      role: targetRole,
      progress,
      completedCount,
      totalTopics,
      completionPercentage,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch progress' }, { status: 500 });
  }
}
