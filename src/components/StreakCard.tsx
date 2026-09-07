'use client';

import React from 'react';
import { Flame, Trophy, Calendar, Zap, AlertCircle } from 'lucide-react';
import { getStreakMessage } from '@/lib/streak-utils';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastLearningDate?: string;
  isDailyGoalCompletedToday?: boolean;
}

export default function StreakCard({
  currentStreak,
  longestStreak,
  lastLearningDate,
  isDailyGoalCompletedToday,
}: StreakCardProps) {
  const streakMessage = getStreakMessage(currentStreak);

  // Recent 7 days streak indicators
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50/70 dark:from-gray-900 via-white dark:via-gray-900 to-orange-50/40 dark:to-amber-950/30 border border-amber-300/50 dark:border-amber-500/20 p-6 shadow-xl shadow-amber-500/5 transition-colors duration-200">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Flame & Main Streak Count */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/30">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-900 dark:bg-gray-950">
              <Flame className="h-9 w-9 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {currentStreak}
              </span>
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Day Learning Streak
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-gray-300 font-medium">{streakMessage}</p>
          </div>
        </div>

        {/* Longest streak stats pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700/60 text-xs text-slate-700 dark:text-gray-300 shadow-sm">
            <Trophy className="h-3.5 w-3.5 text-yellow-500 dark:text-yellow-400" />
            <span>Best: <strong className="text-slate-900 dark:text-white font-bold">{longestStreak} Days</strong></span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
            isDailyGoalCompletedToday
              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
              : 'bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300'
          }`}>
            {isDailyGoalCompletedToday ? (
              <>
                <Zap className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>Today Active</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                <span>Goal Incomplete</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 7-Day Consistency Dots */}
      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-gray-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-600 dark:text-gray-400 font-medium flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" /> Weekly Consistency
        </span>
        <div className="flex items-center gap-2">
          {days.map((day, idx) => {
            const isToday = idx === todayIndex;
            const isPast = idx < todayIndex;
            const active = isPast || (isToday && isDailyGoalCompletedToday) || (currentStreak > 7 - idx);

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                    active
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-gray-950 shadow-md shadow-amber-500/20'
                      : isToday
                      ? 'border-2 border-dashed border-amber-500 text-amber-600 dark:text-amber-300 bg-amber-500/10'
                      : 'bg-slate-200 dark:bg-gray-800/80 text-slate-500 dark:text-gray-500'
                  }`}
                >
                  {day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
