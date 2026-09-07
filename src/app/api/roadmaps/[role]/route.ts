import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { role: string } }
) {
  try {
    const roleSlug = params.role;
    const roadmap = dbRepo.getRoadmapByRole(roleSlug);

    if (!roadmap) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    const user = getCurrentUserFromRequest(request);
    let progress: any[] = [];
    if (user) {
      progress = dbRepo.getUserProgress(user.id, roadmap.role);
    }

    return NextResponse.json({
      success: true,
      roadmap,
      progress,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch roadmap details' }, { status: 500 });
  }
}
