'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  PartyPopper,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { useRouter } from 'next/navigation';
import { User, DailyGoal, Roadmap } from '@/types';
import { fireCelebrationConfetti } from '@/components/ConfettiTrigger';
import { getAuthHeaders } from '@/lib/client-auth';

export default function GoalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedRoadmapTopicId, setSelectedRoadmapTopicId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGoalsData();
  }, []);

  const fetchGoalsData = async () => {
    try {
      const userRes = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const userData = await userRes.json();
      if (userData.success && userData.user) {
        setUser(userData.user);

        const goalRes = await fetch('/api/goals', {
          headers: getAuthHeaders(),
          credentials: 'include',
        });
        const goalData = await goalRes.json();
        if (goalData.success) {
          setDailyGoal(goalData.goal);
        }

        const roadmapRes = await fetch(`/api/roadmaps/${encodeURIComponent(userData.user.targetRole)}`, {
          headers: getAuthHeaders(),
          credentials: 'include',
        });
        const roadmapData = await roadmapRes.json();
        if (roadmapData.success) {
          setRoadmap(roadmapData.roadmap);
        }
      } else {
        router.push('/login');
        return;
      }
    } catch {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/goals/toggle', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
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
        if (data.goal.completed) {
          fireCelebrationConfetti();
        }
      }
    } catch {
      // ignore
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    let titleToAdd = newTaskTitle.trim();
    let topicId: string | undefined = undefined;
    let sectionId: string | undefined = undefined;

    if (selectedRoadmapTopicId && roadmap) {
      for (const sec of roadmap.sections) {
        const top = sec.topics.find((t) => t.id === selectedRoadmapTopicId);
        if (top) {
          titleToAdd = `${sec.title.replace(/^Section \d+ — |^Stage \d+ — /, '')} — ${top.title}`;
          topicId = top.id;
          sectionId = sec.id;
          break;
        }
      }
    }

    if (!titleToAdd || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ title: titleToAdd, topicId, sectionId }),
      });
      const data = await res.json();
      if (data.success) {
        setDailyGoal(data.goal);
        setNewTaskTitle('');
        setSelectedRoadmapTopicId('');
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex flex-col transition-colors duration-200">
      <Navbar user={user} />

      <div className="flex-1 flex w-full">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            {/* Header Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-amber-50 dark:from-amber-950/40 via-white dark:via-gray-900 to-indigo-50 dark:to-indigo-950/40 border border-amber-300 dark:border-amber-500/20 p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
                    <Flame className="h-3.5 w-3.5 fill-amber-500 dark:fill-amber-400" />
                    <span>{user?.currentStreak} Day Streak Active</span>
                  </span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                    Daily Goal Target: {user?.dailyGoalTarget || 3} Tasks
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Daily Goals & Habit Tracker
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1 max-w-2xl leading-relaxed">
                  Complete today's learning checklist to maintain your streak and accelerate placement readiness.
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-gray-950/80 border border-slate-200 dark:border-gray-800 p-4 sm:p-5 shrink-0 text-right shadow-sm">
                <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                  {dailyGoal?.completedTasksCount} / {dailyGoal?.totalTasksCount}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-wider block">
                  Today's Tasks Done
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Left Column: Today's Checklist */}
            <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-xl transition-colors duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's Active Tasks</h2>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {dailyGoal?.completionPercentage}% Complete
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${dailyGoal?.completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Tasks List */}
              <div className="mt-6 space-y-3">
                {dailyGoal?.tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all border ${
                      task.completed
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-400 dark:text-gray-400'
                        : 'bg-slate-50 dark:bg-gray-950/60 hover:bg-slate-100 dark:hover:bg-gray-800 border-slate-200 dark:border-gray-800 text-slate-800 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="shrink-0">
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-400 dark:text-gray-500 hover:text-indigo-500 transition-colors" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          task.completed ? 'line-through text-slate-400 dark:text-gray-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {task.completed && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0 ml-2">
                        Done
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Goal Celebration Box */}
              {dailyGoal?.completed && (
                <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-50 dark:from-emerald-950/60 to-indigo-50 dark:to-indigo-950/40 border border-emerald-300 dark:border-emerald-500/30 p-4 flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <PartyPopper className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Daily Goal Achieved! 🎉</h4>
                    <p className="text-xs text-slate-600 dark:text-gray-300">
                      Outstanding work! Your streak is secured for today. Ready for extra practice or rest up for tomorrow.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Add Tasks Form & Roadmap Picker */}
            <div className="lg:col-span-5 space-y-6">
              {/* Add Custom Task Form */}
              <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-xl transition-colors duration-200">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Add Topic to Today's Goal</span>
                </h3>

                <form onSubmit={handleAddTask} className="space-y-4">
                  {/* Select from Roadmap Topics */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1.5">
                      Pick from {user?.targetRole} Roadmap
                    </label>
                    <select
                      value={selectedRoadmapTopicId}
                      onChange={(e) => {
                        setSelectedRoadmapTopicId(e.target.value);
                        if (e.target.value) setNewTaskTitle('');
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">-- Choose a roadmap milestone --</option>
                      {roadmap?.sections.map((sec) => (
                        <optgroup key={sec.id} label={sec.title}>
                          {sec.topics.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title} ({t.difficulty || 'intermediate'})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div className="text-center text-[10px] text-slate-400 dark:text-gray-500 uppercase font-semibold">
                    OR TYPE CUSTOM GOAL
                  </div>

                  {/* Custom Title Input */}
                  <div>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => {
                        setNewTaskTitle(e.target.value);
                        if (e.target.value) setSelectedRoadmapTopicId('');
                      }}
                      placeholder="e.g. Complete 3 Binary Search practice problems"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={(!newTaskTitle.trim() && !selectedRoadmapTopicId) || isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isSubmitting ? 'Adding...' : "Add to Today's Tasks"}</span>
                  </button>
                </form>
              </div>

              {/* Consistency Habit Rules Card */}
              <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-xl transition-colors duration-200">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  <span>How Streaks Work</span>
                </h3>
                <ul className="text-xs text-slate-600 dark:text-gray-400 space-y-2 leading-relaxed list-disc list-inside">
                  <li>Complete all required tasks in today's goal to count towards your streak.</li>
                  <li>Streak increments automatically without double-counting on the same day.</li>
                  <li>Unlock milestone badges at 3, 7, and 30-day continuous streaks!</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

      <MobileNav />
    </div>
  );
}
