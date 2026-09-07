'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Flame,
  CheckCircle2,
  Sparkles,
  Map,
  CheckSquare,
  ArrowRight,
  Layers,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import StreakCard from '@/components/StreakCard';
import ReadinessGauge from '@/components/ReadinessGauge';
import DailyGoalsCard from '@/components/DailyGoalsCard';
import ContinueLearningCard from '@/components/ContinueLearningCard';
import RoleSwitcherModal from '@/components/RoleSwitcherModal';
import {
  User,
  Roadmap,
  DailyGoal,
  PlacementReadinessReport,
  TargetRole,
} from '@/types';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [readinessReport, setReadinessReport] = useState<PlacementReadinessReport | null>(null);
  const [completedTopicsCount, setCompletedTopicsCount] = useState(0);
  const [totalTopicsCount, setTotalTopicsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      if (userData.success && userData.user) {
        setUser(userData.user);

        const targetRole = userData.user.targetRole || 'Frontend Developer';
        const roadmapRes = await fetch(`/api/roadmaps/${encodeURIComponent(targetRole)}`);
        const roadmapData = await roadmapRes.json();

        if (roadmapData.success) {
          setRoadmap(roadmapData.roadmap);
          const totalTopics = roadmapData.roadmap.totalTopicsCount || 1;
          const completedCount = roadmapData.progress.filter((p: any) => p.completed).length;
          setCompletedTopicsCount(completedCount);
          setTotalTopicsCount(totalTopics);
        }

        const goalRes = await fetch('/api/goals');
        const goalData = await goalRes.json();
        if (goalData.success) {
          setDailyGoal(goalData.goal);
        }

        const profRes = await fetch('/api/profile');
        const profData = await profRes.json();
        if (profData.success && profData.readinessReport) {
          setReadinessReport(profData.readinessReport);
        }
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleGoalTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/goals/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();
      if (data.success) {
        setDailyGoal(data.goal);
        if (user) {
          setUser({
            ...user,
            currentStreak: data.currentStreak,
            longestStreak: data.longestStreak,
          });
        }
        fetchDashboardData();
      }
    } catch {
      // ignore
    }
  };

  const handleAddGoalTask = async (title: string) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (data.success) {
        setDailyGoal(data.goal);
      }
    } catch {
      // ignore
    }
  };

  const handleSwitchRole = async (newRole: TargetRole) => {
    try {
      const res = await fetch('/api/profile/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setRoadmap(data.roadmap);
        fetchDashboardData();
      }
    } catch {
      // ignore
    }
  };

  const roadmapPct = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">Loading your placement workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex flex-col transition-colors duration-200">
      <Navbar user={user} onOpenRoleSwitcher={() => setIsRoleModalOpen(true)} />

      <div className="flex-1 flex w-full">
        <Sidebar />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            {/* Welcome Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-gray-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Good day, {user?.name || 'Student'} 👋
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 hidden sm:inline-block">
                    {user?.skillLevel || 'Intermediate'} Level
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-medium">
                  Ready to continue your <strong className="text-indigo-600 dark:text-indigo-300 font-semibold">{user?.targetRole}</strong> placement preparation?
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  href="/roadmap"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                >
                  <Map className="h-3.5 w-3.5" />
                  <span>Open Roadmap</span>
                </Link>

                <button
                  onClick={() => setIsRoleModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 hover:bg-slate-100 dark:hover:bg-gray-800 border border-slate-200 dark:border-gray-700 text-xs font-semibold text-slate-700 dark:text-gray-300 transition-all shadow-sm"
                >
                  <Layers className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Switch Role</span>
                </button>
              </div>
            </div>

            {/* Top Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {/* Stat 1: Target Role */}
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-4 sm:p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Target Track
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate mt-0.5">
                  {user?.targetRole}
                </h3>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
                  {roadmap?.estimatedWeeks || 16} Weeks Program
                </span>
              </div>
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Map className="h-5 w-5" />
              </div>
            </div>

            {/* Stat 2: Roadmap Progress */}
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-4 sm:p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Curriculum Progress
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {roadmapPct}%
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
                  {completedTopicsCount} of {totalTopicsCount} Completed
                </span>
              </div>
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            {/* Stat 3: Today's Goal Progress */}
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-4 sm:p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Today's Goal
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {dailyGoal?.completedTasksCount || 0} / {dailyGoal?.totalTasksCount || 3}
                </h3>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1 block">
                  {dailyGoal?.completed ? '🎉 Finished' : `${dailyGoal?.completionPercentage || 0}% Done`}
                </span>
              </div>
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <CheckSquare className="h-5 w-5" />
              </div>
            </div>

            {/* Stat 4: Placement Readiness */}
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-4 sm:p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Readiness Index
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {readinessReport?.score || user?.readinessScore || 74}%
                </h3>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-1 block">
                  {readinessReport?.level || 'Placement Ready Path'}
                </span>
              </div>
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Habit Streak & Next Recommended Topic Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-6">
              <StreakCard
                currentStreak={user?.currentStreak || 0}
                longestStreak={user?.longestStreak || 0}
                lastLearningDate={user?.lastLearningDate}
                isDailyGoalCompletedToday={dailyGoal?.completed}
              />
            </div>

            <div className="lg:col-span-6">
              <ContinueLearningCard
                nextTopic={readinessReport?.nextRecommendedTopic}
                roadmapSlug={roadmap?.slug}
              />
            </div>
          </div>

          {/* Placement Readiness Gauge Component */}
          <div className="mt-6">
            <ReadinessGauge report={readinessReport} score={user?.readinessScore} />
          </div>

          {/* Daily Goals Card & Interactive Roadmap Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Daily Goals Card */}
            <div className="lg:col-span-5">
              {dailyGoal && (
                <DailyGoalsCard
                  goal={dailyGoal}
                  onToggleTask={handleToggleGoalTask}
                  onAddTask={handleAddGoalTask}
                />
              )}
            </div>

            {/* Curriculum Roadmap Sections Quick View */}
            <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-xl flex flex-col justify-between transition-colors duration-200">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {user?.targetRole} Curriculum
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                        {roadmap?.sections.length || 0} Major Sections • {totalTopicsCount} Learning Milestones
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/roadmap"
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 group"
                  >
                    <span>Full Checklist</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="mt-4 space-y-3">
                  {roadmap?.sections.slice(0, 4).map((sec, idx) => {
                    const secCompleted = sec.topics.filter((t) =>
                      readinessReport ? !readinessReport.needsImprovement.includes(sec.title) : idx < 2
                    ).length;
                    const pct = Math.round((secCompleted / sec.topics.length) * 100);

                    return (
                      <Link
                        key={sec.id}
                        href="/roadmap"
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-gray-950/60 hover:bg-slate-100 dark:hover:bg-gray-850 border border-slate-200 dark:border-gray-800 transition-all group shadow-sm"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                            {sec.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">
                            {sec.topics.length} Checkable Topics
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="h-1.5 w-20 rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                              style={{ width: `${Math.min(100, (idx + 1) * 28)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 dark:text-gray-300">
                            {Math.min(100, (idx + 1) * 28)}%
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-gray-800/80 text-center">
                <Link
                  href="/roadmap"
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                >
                  View all {roadmap?.sections.length} sections in interactive roadmap →
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

      <MobileNav />

      {/* Role Switcher Dialog */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        currentRole={user?.targetRole || 'Frontend Developer'}
        onClose={() => setIsRoleModalOpen(false)}
        onSelectRole={handleSwitchRole}
      />
    </div>
  );
}
