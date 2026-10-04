'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Award,
  Sparkles,
  Layers,
  Map,
  Briefcase,
  Trophy,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import AchievementBadgeCard from '@/components/AchievementBadgeCard';
import RoleSwitcherModal from '@/components/RoleSwitcherModal';
import { useRouter } from 'next/navigation';
import { User, AchievementBadge, PlacementReadinessReport, TargetRole } from '@/types';
import { getAuthHeaders } from '@/lib/client-auth';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<AchievementBadge[]>([]);
  const [readinessReport, setReadinessReport] = useState<PlacementReadinessReport | null>(null);
  const [totalCompletedTopics, setTotalCompletedTopics] = useState(0);
  const [totalRoadmapTopics, setTotalRoadmapTopics] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const res = await fetch('/api/profile', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setAchievements(data.achievements || []);
        setReadinessReport(data.readinessReport);
        setTotalCompletedTopics(data.totalCompletedTopics || 0);
        setTotalRoadmapTopics(data.totalRoadmapTopics || 0);
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

  const handleSwitchRole = async (newRole: TargetRole) => {
    try {
      const res = await fetch('/api/profile/switch-role', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ targetRole: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProfileData();
      }
    } catch {
      // ignore
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex flex-col transition-colors duration-200">
      <Navbar user={user} onOpenRoleSwitcher={() => setIsRoleModalOpen(true)} />

      <div className="flex-1 flex w-full">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            {/* Profile Hero Card */}
          <div className="rounded-3xl bg-gradient-to-r from-indigo-50 dark:from-indigo-950/60 via-purple-50 dark:via-purple-950/40 to-white dark:to-gray-900 border border-indigo-200 dark:border-indigo-900/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                {/* Large Avatar */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-0.5 shadow-xl">
                  <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-slate-900 dark:bg-gray-950 text-2xl font-black text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {user?.name || 'Student'}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                      {user?.skillLevel || 'Intermediate'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400">{user?.email}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-300 mt-1 font-semibold flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                    Target Role: {user?.targetRole}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto">
                <button
                  onClick={() => setIsRoleModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                >
                  <Layers className="h-4 w-4" />
                  <span>Switch Career Role</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                <Flame className="h-4 w-4 fill-amber-500 dark:fill-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Current Streak</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{user?.currentStreak || 0} Days</div>
              <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 block">Best: {user?.longestStreak || 0} Days</span>
            </div>

            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                <Map className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Topics Done</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCompletedTopics}</div>
              <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 block">of {totalRoadmapTopics} in Roadmap</span>
            </div>

            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Readiness Score</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{readinessReport?.score || user?.readinessScore || 74}%</div>
              <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 block">{readinessReport?.level || 'Placement Ready'}</span>
            </div>

            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <Trophy className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Badges Earned</span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{unlockedCount} / {achievements.length}</div>
              <span className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 block">Achievements</span>
            </div>
          </div>

          {/* Achievement Badges Showcase */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                  <span>Placement Milestones & Badges</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                  Earn badges by hitting study streaks, completing projects, and reaching readiness thresholds.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
                {unlockedCount} of {achievements.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((badge) => (
                <AchievementBadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>

      <MobileNav />

      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        currentRole={user?.targetRole || 'Frontend Developer'}
        onClose={() => setIsRoleModalOpen(false)}
        onSelectRole={handleSwitchRole}
      />
    </div>
  );
}
