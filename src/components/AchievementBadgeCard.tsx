'use client';

import React from 'react';
import {
  Sparkles,
  Flame,
  Zap,
  Crown,
  BookOpen,
  Trophy,
  Award,
  Laptop,
  Target,
  GraduationCap,
  Lock,
} from 'lucide-react';
import { AchievementBadge } from '@/types';

interface AchievementBadgeCardProps {
  badge: AchievementBadge;
}

const ICON_MAP: Record<string, any> = {
  Sparkles,
  Flame,
  Zap,
  Crown,
  BookOpen,
  Trophy,
  Award,
  Laptop,
  Target,
  GraduationCap,
};

export default function AchievementBadgeCard({ badge }: AchievementBadgeCardProps) {
  const IconComponent = ICON_MAP[badge.icon] || Trophy;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 border transition-all duration-200 ${
        badge.unlocked
          ? 'bg-gradient-to-br from-amber-50/80 dark:from-indigo-950/40 via-white dark:via-gray-900 to-orange-50/50 dark:to-amber-950/30 border-amber-300 dark:border-amber-500/40 shadow-md'
          : 'bg-white dark:bg-gray-900/60 border-slate-200 dark:border-gray-800/80 opacity-75'
      }`}
    >
      {badge.unlocked && (
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
      )}

      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all ${
            badge.unlocked
              ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 text-gray-950 border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-gray-500 border-slate-200 dark:border-gray-700'
          }`}
        >
          {badge.unlocked ? (
            <IconComponent className="h-6 w-6" />
          ) : (
            <Lock className="h-5 w-5 text-slate-400 dark:text-gray-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`text-sm font-bold truncate ${
                badge.unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-400'
              }`}
            >
              {badge.title}
            </h4>
            {badge.unlocked && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                Unlocked
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">{badge.description}</p>
        </div>
      </div>

      {/* Progress Bar for Locked Badges */}
      {!badge.unlocked && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800/80">
          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{badge.progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${badge.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
