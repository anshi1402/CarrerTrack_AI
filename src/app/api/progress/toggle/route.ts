import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { dbRepo } from '@/lib/db';
import { calculatePlacementReadiness } from '@/lib/readiness';
import { evaluateAndUpdateStreak } from '@/lib/streaks';
import { TargetRole } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { topicId, sectionId, role } = body;

    if (!topicId || !sectionId) {
      return NextResponse.json({ error: 'topicId and sectionId are required' }, { status: 400 });
    }

    const targetRole: TargetRole = role || user.targetRole;
    const { completed, allProgress } = await dbRepo.toggleProgress(user.id, targetRole, topicId, sectionId);

    // Fetch roadmap
    const roadmap = await dbRepo.getRoadmapByRole(targetRole);
    if (!roadmap) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    const todayGoal = await dbRepo.getDailyGoal(user.id);
    const { currentStreak, longestStreak, streakIncreased } = await evaluateAndUpdateStreak(user.id, todayGoal);

    // Compute updated readiness score
    const readinessReport = calculatePlacementReadiness(user, roadmap, allProgress, [todayGoal]);
    const completedTopicsCount = allProgress.filter((p) => p.completed).length;

    // Check project count
    const projectTopics = roadmap.sections
      .flatMap((s) => s.topics)
      .filter((t) => t.isProject || t.category === 'project');
    const completedProjectIds = new Set(allProgress.filter((p) => p.completed).map((p) => p.topicId));
    const completedProjectsCount = projectTopics.filter((t) => completedProjectIds.has(t.id)).length;

    // Update user stats
    await dbRepo.updateUser(user.id, {
      readinessScore: readinessReport.score,
      completedTopicsCount,
      completedProjectsCount,
    });

    // Milestone check & notifications
    let newlyUnlockedBadge: string | null = null;
    const achievements = await dbRepo.getAchievements(user.id);
    let achievementsModified = false;

    achievements.forEach((badge) => {
      if (!badge.unlocked) {
        if (badge.id === 'first_topic' && completedTopicsCount >= 1) {
          badge.unlocked = true;
          badge.progress = 100;
          badge.unlockedAt = new Date().toISOString();
          newlyUnlockedBadge = badge.title;
          achievementsModified = true;
        } else if (badge.id === 'topics_10' && completedTopicsCount >= 10) {
          badge.unlocked = true;
          badge.progress = 100;
          badge.unlockedAt = new Date().toISOString();
          newlyUnlockedBadge = badge.title;
          achievementsModified = true;
        } else if (badge.id === 'topics_25' && completedTopicsCount >= 25) {
          badge.unlocked = true;
          badge.progress = 100;
          badge.unlockedAt = new Date().toISOString();
          newlyUnlockedBadge = badge.title;
          achievementsModified = true;
        } else if (badge.id === 'topics_50' && completedTopicsCount >= 50) {
          badge.unlocked = true;
          badge.progress = 100;
          badge.unlockedAt = new Date().toISOString();
          newlyUnlockedBadge = badge.title;
          achievementsModified = true;
        } else if (badge.id === 'first_project' && completedProjectsCount >= 1) {
          badge.unlocked = true;
          badge.progress = 100;
          badge.unlockedAt = new Date().toISOString();
          newlyUnlockedBadge = badge.title;
          achievementsModified = true;
        } else if (badge.id === 'readiness_50' && readinessReport.score >= 50) {
          badge.unlocked = true;
          badge.progress = 100;
          badge.unlockedAt = new Date().toISOString();
          newlyUnlockedBadge = badge.title;
          achievementsModified = true;
        } else if (badge.id === 'readiness_80' && readinessReport.score >= 80) {
          badge.unlocked = true;
          badge.progress = 100;
          badge.unlockedAt = new Date().toISOString();
          newlyUnlockedBadge = badge.title;
          achievementsModified = true;
        }
      }
    });

    if (achievementsModified) {
      await dbRepo.updateAchievements(user.id, achievements);
      if (newlyUnlockedBadge) {
        await dbRepo.addNotification({
          id: 'notif-' + Date.now(),
          userId: user.id,
          type: 'milestone',
          title: `🏆 Badge Unlocked: ${newlyUnlockedBadge}!`,
          message: `Great job! You just unlocked the '${newlyUnlockedBadge}' achievement on your learning journey!`,
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    // If daily goal completed, notify
    if (todayGoal.completed && streakIncreased) {
      await dbRepo.addNotification({
        id: 'notif-' + Date.now(),
        userId: user.id,
        type: 'goal_completed',
        title: 'Daily Goal Completed! 🎉',
        message: `Great job! Today's daily goal is 100% finished. Your ${currentStreak}-day streak continues!`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      topicId,
      completed,
      completedTopicsCount,
      readinessScore: readinessReport.score,
      readinessReport,
      todayGoal,
      currentStreak,
      longestStreak,
      streakIncreased,
      newlyUnlockedBadge,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to toggle progress' }, { status: 500 });
  }
}
