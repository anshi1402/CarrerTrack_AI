'use client';

import React from 'react';
import Link from 'next/link';
import { PlayCircle, Sparkles, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { RoadmapTopic } from '@/types';

interface ContinueLearningCardProps {
  nextTopic?: {
    topic: RoadmapTopic;
    sectionTitle: string;
    reason: string;
  } | null;
  roadmapSlug?: string;
  onToggleComplete?: (topicId: string, sectionId: string) => Promise<void>;
}

export default function ContinueLearningCard({
  nextTopic,
  roadmapSlug = 'frontend-developer',
}: ContinueLearningCardProps) {
  if (!nextTopic) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 dark:from-emerald-950/40 to-white dark:to-gray-900 border border-emerald-300 dark:border-emerald-500/30 p-6 shadow-xl text-center transition-colors duration-200">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-3">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Roadmap Fully Completed! 🎓</h3>
        <p className="mt-1 text-xs text-slate-600 dark:text-gray-300">
          Incredible achievement! You have mastered all topics. Review interview questions or switch to an advanced career role.
        </p>
        <Link
          href="/roadmap"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all shadow-lg"
        >
          <span>Explore All Topics</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  const { topic, sectionTitle, reason } = nextTopic;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-50/70 dark:from-indigo-950/50 via-white dark:via-gray-900 to-purple-50/50 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-500/30 p-6 shadow-xl relative overflow-hidden transition-colors duration-200">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            Next Recommended Milestone
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30">
          {topic.difficulty || 'Intermediate'}
        </span>
      </div>

      <div className="mt-4">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
          {sectionTitle}
        </span>
        <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5 tracking-tight flex items-center gap-2">
          {topic.title}
        </h4>

        <div className="mt-2.5 rounded-xl bg-slate-50 dark:bg-gray-950/60 border border-slate-200 dark:border-indigo-900/40 p-3">
          <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
            💡 <strong className="text-indigo-700 dark:text-indigo-300">Why this next?</strong> {reason}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-gray-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
          <BookOpen className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Est. Time: {topic.estimatedHours || 3} Hours</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/roadmap/${roadmapSlug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            <PlayCircle className="h-4 w-4" />
            <span>Continue in Roadmap</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
