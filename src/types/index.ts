export type TargetRole =
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'Java Developer'
  | 'Python Developer'
  | 'Data Analyst'
  | 'Data Scientist'
  | 'DevOps Engineer'
  | 'UI/UX Designer'
  | 'Software Developer';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserNotificationPreferences {
  dailyGoalReminder: boolean;
  streakReminder: boolean;
  achievementNotifications: boolean;
  weeklyProgressSummary: boolean;
  browserNotifications: boolean;
  reminderTime: string; // e.g. "20:00"
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  targetRole: TargetRole;
  skillLevel: SkillLevel;
  dailyGoalTarget: number; // e.g. 3
  reminderTime: string; // e.g. "20:00"
  notificationPreferences: UserNotificationPreferences;
  currentStreak: number;
  longestStreak: number;
  lastLearningDate?: string; // YYYY-MM-DD
  readinessScore: number; // 0-100
  completedTopicsCount: number;
  completedProjectsCount: number;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  description?: string;
  category: 'core' | 'framework' | 'database' | 'integration' | 'project' | 'interview' | 'dsa';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours?: number;
  resources?: { title: string; url: string; type: 'doc' | 'video' | 'practice' }[];
  isProject?: boolean;
  isInterviewQuestion?: boolean;
}

export interface RoadmapSubSection {
  id: string;
  title: string;
  topics: RoadmapTopic[];
}

export interface RoadmapSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  subSections?: RoadmapSubSection[];
  topics: RoadmapTopic[];
}

export interface Roadmap {
  id: string;
  role: TargetRole;
  slug: string;
  title: string;
  description: string;
  icon: string;
  estimatedWeeks: number;
  totalTopicsCount: number;
  sections: RoadmapSection[];
}

export interface UserProgressItem {
  id: string;
  userId: string;
  role: TargetRole;
  topicId: string;
  sectionId: string;
  completed: boolean;
  completedAt?: string;
}

export interface DailyGoalTask {
  id: string;
  topicId?: string;
  sectionId?: string;
  title: string;
  role?: TargetRole;
  completed: boolean;
  completedAt?: string;
}

export interface DailyGoal {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  tasks: DailyGoalTask[];
  completedTasksCount: number;
  totalTasksCount: number;
  completed: boolean;
  completionPercentage: number;
}

export interface LearningActivityDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  topicsCompleted: number;
  goalsCompleted: number;
  studyMinutes: number;
}

export interface UserNotification {
  id: string;
  userId: string;
  type: 'daily_reminder' | 'streak_risk' | 'goal_completed' | 'milestone' | 'welcome';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  icon?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'topics' | 'readiness' | 'projects' | 'special';
  requiredCount: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 to 100
}

export interface PlacementReadinessReport {
  score: number; // 0-100
  level: 'Just Started' | 'Building Foundation' | 'Developing Skills' | 'Placement Ready Path' | 'Highly Prepared';
  levelDescription: string;
  roadmapProgressPct: number;
  consistencyScorePct: number;
  projectsScorePct: number;
  interviewScorePct: number;
  strongAreas: string[];
  needsImprovement: string[];
  nextRecommendedTopic?: {
    topic: RoadmapTopic;
    sectionTitle: string;
    reason: string;
  };
}

export interface AnalyticsSummary {
  weeklyActivity: LearningActivityDay[];
  monthlyTrends: { month: string; completedCount: number }[];
  skillProgress: { skill: string; percentage: number; completed: number; total: number }[];
  totalTopicsCompleted: number;
  totalGoalsCompleted: number;
  streakHistory: { current: number; longest: number; totalActiveDays: number };
  weeklyConsistencyRate: number; // percentage
  readinessReport?: PlacementReadinessReport | null;
}
