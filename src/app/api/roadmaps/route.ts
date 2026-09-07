import { NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';

export async function GET() {
  try {
    const roadmaps = dbRepo.getAllRoadmaps();
    const summary = roadmaps.map((r) => ({
      id: r.id,
      role: r.role,
      slug: r.slug,
      title: r.title,
      description: r.description,
      icon: r.icon,
      estimatedWeeks: r.estimatedWeeks,
      totalTopicsCount: r.totalTopicsCount,
      sectionsCount: r.sections.length,
    }));

    return NextResponse.json({ success: true, roadmaps: summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch roadmaps' }, { status: 500 });
  }
}
