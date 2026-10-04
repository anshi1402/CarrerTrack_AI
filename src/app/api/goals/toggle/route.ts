import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { dbRepo } from '@/lib/db';
import { evaluateAndUpdateStreak } from '@/lib/streaks';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, date } = body;

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const goal = await dbRepo.getDailyGoal(user.id, date);
    const task = goal.tasks.find((t) => t.id === taskId);

    if (!task) {
      return NextResponse.json({ error: 'Task not found in daily goal' }, { status: 404 });
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : undefined;

    goal.completedTasksCount = goal.tasks.filter((t) => t.completed).length;
    goal.completionPercentage = Math.round((goal.completedTasksCount / (goal.totalTasksCount || 1)) * 100);
    goal.completed = goal.completedTasksCount >= goal.totalTasksCount;

    await dbRepo.saveDailyGoal(goal);

    // If task links to a topic, sync roadmap progress
    if (task.topicId && task.sectionId) {
      const existingProg = await dbRepo.getUserProgress(user.id, user.targetRole);
      const progItem = existingProg.find((p) => p.topicId === task.topicId);
      if (progItem && progItem.completed !== task.completed) {
        await dbRepo.toggleProgress(user.id, user.targetRole, task.topicId, task.sectionId);
      }
    }

    const { currentStreak, longestStreak, streakIncreased } = await evaluateAndUpdateStreak(user.id, goal);

    return NextResponse.json({
      success: true,
      goal,
      task,
      currentStreak,
      longestStreak,
      streakIncreased,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to toggle daily task' }, { status: 500 });
  }
}
