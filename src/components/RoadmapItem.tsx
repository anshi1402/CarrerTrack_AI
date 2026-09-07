'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  Briefcase,
  HelpCircle,
  FileCode,
  Info,
  Check,
  ChevronRight,
} from 'lucide-react';
import { RoadmapTopic } from '@/types';

interface RoadmapItemProps {
  topic: RoadmapTopic;
  sectionId: string;
  completed: boolean;
  onToggle: (topicId: string, sectionId: string) => Promise<void>;
}

export default function RoadmapItem({
  topic,
  sectionId,
  completed,
  onToggle,
}: RoadmapItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onToggle(topic.id, sectionId);
    } finally {
      setIsUpdating(false);
    }
  };

  const getCategoryBadge = () => {
    if (topic.isProject || topic.category === 'project') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
          <Briefcase className="h-2.5 w-2.5" /> Project
        </span>
      );
    }
    if (topic.isInterviewQuestion || topic.category === 'interview') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-500/30">
          <HelpCircle className="h-2.5 w-2.5" /> Interview
        </span>
      );
    }
    if (topic.category === 'dsa') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/30">
          <FileCode className="h-2.5 w-2.5" /> DSA
        </span>
      );
    }
    if (topic.category === 'integration') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30">
          <Code2 className="h-2.5 w-2.5" /> Integration
        </span>
      );
    }
    return null;
  };

  const getDifficultyColor = (diff?: string) => {
    if (diff === 'advanced') return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/20';
    if (diff === 'intermediate') return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/20';
    return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/20';
  };

  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        className={`group flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all border ${
          completed
            ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-800 text-slate-400 dark:text-gray-400'
            : 'bg-white dark:bg-gray-900/80 hover:bg-slate-50 dark:hover:bg-gray-850 border-slate-200 dark:border-gray-800/80 hover:border-slate-300 dark:hover:border-gray-700 text-slate-800 dark:text-gray-200 shadow-sm'
        }`}
      >
        {/* Checkbox and Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleToggle}
            disabled={isUpdating}
            className="shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
            aria-label={`Mark ${topic.title} as ${completed ? 'incomplete' : 'complete'}`}
          >
            {completed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950 hover:scale-110 transition-transform" />
            ) : (
              <Circle className="h-5 w-5 text-slate-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all" />
            )}
          </button>

          <div className="flex flex-col min-w-0">
            <span
              className={`text-xs sm:text-sm font-medium leading-snug truncate ${
                completed ? 'line-through text-slate-400 dark:text-gray-400' : 'text-slate-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-white'
              }`}
            >
              {topic.title}
            </span>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {getCategoryBadge()}

          {topic.difficulty && (
            <span
              className={`hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize border ${getDifficultyColor(
                topic.difficulty
              )}`}
            >
              {topic.difficulty}
            </span>
          )}

          {topic.estimatedHours && (
            <span className="hidden md:flex items-center gap-1 text-[11px] text-slate-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              {topic.estimatedHours}h
            </span>
          )}

          <ChevronRight className="h-4 w-4 text-slate-400 dark:text-gray-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
        </div>
      </div>

      {/* Topic Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-2xl relative">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-gray-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {getCategoryBadge()}
                  {topic.difficulty && (
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize border ${getDifficultyColor(
                        topic.difficulty
                      )}`}
                    >
                      {topic.difficulty}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{topic.title}</h3>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-600 dark:text-gray-300">
              <div className="rounded-2xl bg-slate-50 dark:bg-gray-950/60 p-4 border border-slate-200 dark:border-gray-800">
                <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" /> Placement Relevance
                </h4>
                <p className="leading-relaxed text-slate-700 dark:text-gray-300">
                  {topic.isProject
                    ? 'Hands-on projects are evaluated heavily by hiring managers in resume screening and machine-coding interview rounds.'
                    : topic.isInterviewQuestion
                    ? 'Frequently asked in campus placement technical rounds and technical phone screens.'
                    : 'Fundamental building block required for software engineering competencies.'}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 pt-2">
                <span>Estimated Study Time:</span>
                <strong className="text-slate-900 dark:text-white">{topic.estimatedHours || 3} Hours</strong>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-xs font-semibold text-slate-700 dark:text-gray-200"
              >
                Close
              </button>
              <button
                type="button"
                onClick={async (e) => {
                  await handleToggle(e);
                  setShowDetails(false);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
                  completed
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                <span>{completed ? 'Mark Incomplete' : 'Mark as Completed'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
