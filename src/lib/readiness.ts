import {
  PlacementReadinessReport,
  Roadmap,
  UserProgressItem,
  User,
  DailyGoal,
  RoadmapTopic,
} from '@/types';

export function calculatePlacementReadiness(
  user: User,
  roadmap: Roadmap,
  progress: UserProgressItem[],
  recentGoals: DailyGoal[]
): PlacementReadinessReport {
  const completedTopicIds = new Set(progress.filter((p) => p.completed).map((p) => p.topicId));
  const allTopics: (RoadmapTopic & { sectionTitle: string; sectionId: string })[] = [];

  roadmap.sections.forEach((sec) => {
    sec.topics.forEach((top) => {
      allTopics.push({ ...top, sectionTitle: sec.title, sectionId: sec.id });
    });
  });

  const totalTopics = allTopics.length || 1;
  const completedTopics = allTopics.filter((t) => completedTopicIds.has(t.id));
  const roadmapProgressPct = Math.round((completedTopics.length / totalTopics) * 100);

  // 1. Core & Framework Skills
  const coreTopics = allTopics.filter((t) => t.category === 'core' || t.category === 'framework');
  const completedCore = coreTopics.filter((t) => completedTopicIds.has(t.id));
  const coreProgressPct = coreTopics.length > 0 ? (completedCore.length / coreTopics.length) * 100 : 0;

  // 2. Consistency Score (Streak + Goals)
  const streakFactor = Math.min(100, (user.currentStreak / 14) * 100);
  const goalCompletionFactor =
    recentGoals.length > 0
      ? (recentGoals.filter((g) => g.completed).length / recentGoals.length) * 100
      : 75;
  const consistencyScorePct = Math.round(streakFactor * 0.5 + goalCompletionFactor * 0.5);

  // 3. Projects Score
  const projectTopics = allTopics.filter((t) => t.isProject || t.category === 'project');
  const completedProjects = projectTopics.filter((t) => completedTopicIds.has(t.id));
  const projectsScorePct =
    projectTopics.length > 0 ? Math.round((completedProjects.length / projectTopics.length) * 100) : 0;

  // 4. Interview & DSA Score
  const interviewTopics = allTopics.filter(
    (t) => t.isInterviewQuestion || t.category === 'interview' || t.category === 'dsa'
  );
  const completedInterview = interviewTopics.filter((t) => completedTopicIds.has(t.id));
  const interviewScorePct =
    interviewTopics.length > 0
      ? Math.round((completedInterview.length / interviewTopics.length) * 100)
      : 0;

  // Weighted Total Score
  // 35% Roadmap + 20% Core + 15% Consistency + 15% Projects + 15% Interview
  const rawScore =
    roadmapProgressPct * 0.35 +
    coreProgressPct * 0.2 +
    consistencyScorePct * 0.15 +
    projectsScorePct * 0.15 +
    interviewScorePct * 0.15;

  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Determine Level
  let level: PlacementReadinessReport['level'] = 'Just Started';
  let levelDescription = 'You have begun your journey. Follow the roadmap step by step.';

  if (score > 80) {
    level = 'Highly Prepared';
    levelDescription = 'Outstanding! You have mastered core skills, built projects, and practiced interviews.';
  } else if (score > 60) {
    level = 'Placement Ready Path';
    levelDescription = 'Great progress! You are on track for campus placement tests and technical interviews.';
  } else if (score > 40) {
    level = 'Developing Skills';
    levelDescription = 'Good momentum. Solidify intermediate concepts and start building end-to-end projects.';
  } else if (score > 20) {
    level = 'Building Foundation';
    levelDescription = 'You are learning key concepts. Focus on building consistency and completing daily goals.';
  }

  // Strong Areas vs Needs Improvement
  const strongAreas: string[] = [];
  const needsImprovement: string[] = [];

  roadmap.sections.forEach((sec) => {
    const secTopics = sec.topics;
    const completedSecTopics = secTopics.filter((t) => completedTopicIds.has(t.id));
    const pct = (completedSecTopics.length / (secTopics.length || 1)) * 100;

    const cleanTitle = sec.title.replace(/^Section \d+ — |^Stage \d+ — /, '');
    if (pct >= 60) {
      strongAreas.push(cleanTitle);
    } else if (pct < 50) {
      needsImprovement.push(cleanTitle);
    }
  });

  // Next Recommended Topic
  const nextIncomplete = allTopics.find((t) => !completedTopicIds.has(t.id));
  let nextRecommendedTopic;
  if (nextIncomplete) {
    let reason = 'Next recommended milestone in your curated roadmap order.';
    if (nextIncomplete.isProject) {
      reason = 'You have completed foundational theory; applying your skills in a project is critical for placement portfolios.';
    } else if (nextIncomplete.isInterviewQuestion) {
      reason = 'Reinforcing your interview and problem-solving readiness.';
    } else if (nextIncomplete.category === 'integration') {
      reason = 'Connecting your frontend knowledge with real backend endpoints.';
    }

    nextRecommendedTopic = {
      topic: nextIncomplete,
      sectionTitle: nextIncomplete.sectionTitle,
      reason,
    };
  }

  return {
    score,
    level,
    levelDescription,
    roadmapProgressPct,
    consistencyScorePct,
    projectsScorePct,
    interviewScorePct,
    strongAreas: strongAreas.slice(0, 4),
    needsImprovement: needsImprovement.slice(0, 4),
    nextRecommendedTopic,
  };
}
