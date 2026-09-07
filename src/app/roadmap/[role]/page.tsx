'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Map,
  Search,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import RoadmapSectionCard from '@/components/RoadmapSectionCard';
import RoleSwitcherModal from '@/components/RoleSwitcherModal';
import { User, Roadmap, TargetRole } from '@/types';
import { fireCelebrationConfetti } from '@/components/ConfettiTrigger';

export default function RoleRoadmapPage() {
  const params = useParams();
  const roleSlug = params.role as string;

  const [user, setUser] = useState<User | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'incomplete' | 'projects' | 'interview'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [roleSlug]);

  const fetchData = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      if (userData.success && userData.user) {
        setUser(userData.user);
      }

      const roadmapRes = await fetch(`/api/roadmaps/${encodeURIComponent(roleSlug)}`);
      const roadmapData = await roadmapRes.json();

      if (roadmapData.success) {
        setRoadmap(roadmapData.roadmap);
        const completedSet = new Set<string>(
          roadmapData.progress.filter((p: any) => p.completed).map((p: any) => p.topicId)
        );
        setCompletedTopicIds(completedSet);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTopic = async (topicId: string, sectionId: string) => {
    try {
      const res = await fetch('/api/progress/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId,
          sectionId,
          role: roadmap?.role || 'Frontend Developer',
        }),
      });
      const data = await res.json();

      if (data.success) {
        const nextSet = new Set(completedTopicIds);
        if (data.completed) {
          nextSet.add(topicId);
        } else {
          nextSet.delete(topicId);
        }
        setCompletedTopicIds(nextSet);

        if (data.newlyUnlockedBadge || data.streakIncreased) {
          fireCelebrationConfetti();
        }
      }
    } catch {
      // ignore
    }
  };

  const totalTopics = roadmap?.totalTopicsCount || 1;
  const completedCount = completedTopicIds.size;
  const progressPct = Math.round((completedCount / totalTopics) * 100);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex flex-col transition-colors duration-200">
      <Navbar user={user} onOpenRoleSwitcher={() => setIsRoleModalOpen(true)} />

      <div className="flex-1 flex w-full">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white mb-4"
            >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to All Roadmaps</span>
          </Link>

          {/* Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-indigo-50 dark:from-indigo-950/60 via-purple-50 dark:via-purple-950/40 to-white dark:to-gray-900 border border-indigo-200 dark:border-indigo-900/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  {roadmap?.role}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
                  {roadmap?.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1 max-w-2xl leading-relaxed">
                  {roadmap?.description}
                </p>
              </div>

              <div className="rounded-2xl bg-white dark:bg-gray-950/80 border border-slate-200 dark:border-gray-800 p-4 sm:p-5 shrink-0 flex items-center gap-4 shadow-sm">
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{progressPct}%</span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-wider block">
                    Completed
                  </span>
                </div>
                <div className="h-12 w-1.5 rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-emerald-400 rounded-full"
                    style={{ height: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="h-4 w-4 text-slate-400 dark:text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, skills, or projects..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 self-stretch sm:self-auto overflow-x-auto custom-scrollbar shadow-sm">
              {[
                { id: 'all', label: 'All Topics' },
                { id: 'completed', label: `Completed (${completedCount})` },
                { id: 'incomplete', label: `Remaining (${totalTopics - completedCount})` },
                { id: 'projects', label: 'Projects' },
                { id: 'interview', label: 'Interview Prep' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    filterStatus === f.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sections List */}
          <div className="mt-6 space-y-4">
            {roadmap?.sections.map((section, idx) => (
              <RoadmapSectionCard
                key={section.id}
                section={section}
                completedTopicIds={completedTopicIds}
                searchQuery={searchQuery}
                filterStatus={filterStatus}
                onToggleTopic={handleToggleTopic}
                defaultExpanded={idx < 3}
              />
            ))}
          </div>
        </main>
      </div>
    </div>

      <MobileNav />
    </div>
  );
}
