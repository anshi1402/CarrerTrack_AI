'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FolderKanban, CheckCircle2 } from 'lucide-react';
import { RoadmapSection } from '@/types';
import RoadmapItem from './RoadmapItem';

interface RoadmapSectionCardProps {
  section: RoadmapSection;
  completedTopicIds: Set<string>;
  searchQuery?: string;
  filterStatus?: 'all' | 'completed' | 'incomplete' | 'projects' | 'interview';
  onToggleTopic: (topicId: string, sectionId: string) => Promise<void>;
  defaultExpanded?: boolean;
}

export default function RoadmapSectionCard({
  section,
  completedTopicIds,
  searchQuery = '',
  filterStatus = 'all',
  onToggleTopic,
  defaultExpanded = true,
}: RoadmapSectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const totalTopics = section.topics.length;
  const completedTopicsCount = section.topics.filter((t) => completedTopicIds.has(t.id)).length;
  const progressPercentage = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;
  const isSectionComplete = progressPercentage === 100;

  // Filter topics
  const filteredTopics = section.topics.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const isCompleted = completedTopicIds.has(t.id);
    if (filterStatus === 'completed') return isCompleted;
    if (filterStatus === 'incomplete') return !isCompleted;
    if (filterStatus === 'projects') return t.isProject || t.category === 'project';
    if (filterStatus === 'interview') return t.isInterviewQuestion || t.category === 'interview';

    return true;
  });

  const shouldShow = filteredTopics.length > 0;
  if (!shouldShow && searchQuery) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-xl overflow-hidden transition-all duration-200">
      {/* Section Header Accordion Trigger */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-5 cursor-pointer bg-slate-50/70 dark:bg-gray-900/90 hover:bg-slate-100 dark:hover:bg-gray-850/60 transition-colors border-b border-slate-200 dark:border-gray-800/80"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all ${
              isSectionComplete
                ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400'
            }`}
          >
            {isSectionComplete ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <FolderKanban className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-2">
              {section.title}
              {isSectionComplete && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                  Completed
                </span>
              )}
            </h3>
            {section.description && (
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium truncate mt-0.5">
                {section.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {/* Progress Indicator */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {completedTopicsCount} / {totalTopics}
            </span>
            <div className="h-1.5 w-24 rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isSectionComplete
                    ? 'bg-emerald-500 dark:bg-emerald-400'
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-400'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 sm:hidden">
            {progressPercentage}%
          </span>

          <button
            type="button"
            className="p-1 rounded-xl text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
            aria-label="Toggle section"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Topics List */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-2.5 bg-slate-100/40 dark:bg-gray-950/40">
          {filteredTopics.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-400 dark:text-gray-500">
              No topics matching filter
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <RoadmapItem
                key={topic.id}
                topic={topic}
                sectionId={section.id}
                completed={completedTopicIds.has(topic.id)}
                onToggle={onToggleTopic}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
