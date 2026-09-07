import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { dbRepo } from '@/lib/db';
import { TargetRole } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { targetRole } = body;

    if (!targetRole) {
      return NextResponse.json({ error: 'targetRole is required' }, { status: 400 });
    }

    const updatedUser = dbRepo.updateUser(user.id, {
      targetRole: targetRole as TargetRole,
    });

    const newRoadmap = dbRepo.getRoadmapByRole(targetRole);

    return NextResponse.json({
      success: true,
      user: updatedUser,
      roadmap: newRoadmap,
      message: `Target career role switched to ${targetRole}!`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to switch role' }, { status: 500 });
  }
}
