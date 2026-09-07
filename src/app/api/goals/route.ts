import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { dbRepo } from '@/lib/db';
import { DailyGoalTask } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const goal = dbRepo.getDailyGoal(user.id, dateParam || undefined);

    return NextResponse.json({ success: true, goal });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch daily goal' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, topicId, sectionId } = body;

    if (!title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    const goal = dbRepo.getDailyGoal(user.id);
    const newTask: DailyGoalTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title,
      topicId,
      sectionId,
      role: user.targetRole,
      completed: false,
    };

    goal.tasks.push(newTask);
    goal.totalTasksCount = goal.tasks.length;
    goal.completedTasksCount = goal.tasks.filter((t) => t.completed).length;
    goal.completionPercentage = Math.round((goal.completedTasksCount / goal.totalTasksCount) * 100);
    goal.completed = goal.completedTasksCount >= goal.totalTasksCount;

    dbRepo.saveDailyGoal(goal);

    return NextResponse.json({ success: true, goal, task: newTask });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add daily goal task' }, { status: 500 });
  }
}
