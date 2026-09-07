'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  Plus,
  CheckSquare,
  ArrowRight,
  PartyPopper,
} from 'lucide-react';
import { DailyGoal } from '@/types';
import { fireCelebrationConfetti } from './ConfettiTrigger';

interface DailyGoalsCardProps {
  goal: DailyGoal;
  onToggleTask: (taskId: string) => Promise<void>;
  onAddTask: (title: string) => Promise<void>;
}

export default function DailyGoalsCard({ goal, onToggleTask, onAddTask }: DailyGoalsCardProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = async (taskId: string) => {
    await onToggleTask(taskId);
    if (goal.completedTasksCount + 1 >= goal.totalTasksCount) {
      fireCelebrationConfetti();
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await onAddTask(newTaskTitle.trim());
    setNewTaskTitle('');
    setIsAdding(false);
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-xl relative overflow-hidden transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Today's Daily Goals
              {goal.completed && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/20">
                  <PartyPopper className="h-3 w-3" /> Completed
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
              {goal.completedTasksCount} / {goal.totalTasksCount} tasks completed
            </p>
          </div>
        </div>

        <Link
          href="/goals"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 group"
        >
          <span>Manage Goals</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500 dark:text-gray-400 font-medium">Progress</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{goal.completionPercentage}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${goal.completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Goal Items Checklist */}
      <div className="mt-5 space-y-2.5">
        {goal.tasks.length === 0 ? (
          <div className="py-6 text-center text-slate-400 dark:text-gray-500 text-xs">
            No tasks set for today. Click below to add tasks!
          </div>
        ) : (
          goal.tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => handleToggle(task.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all border ${
                task.completed
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-400 dark:text-gray-400 line-through'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-gray-850/50 dark:hover:bg-gray-800 border-slate-200 dark:border-gray-800 text-slate-800 dark:text-gray-200'
              }`}
            >
              <div className="shrink-0">
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-400 dark:text-gray-500 hover:text-indigo-500 transition-colors" />
                )}
              </div>
              <span className="text-xs sm:text-sm font-medium leading-tight">
                {task.title}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Add Custom Task */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-gray-800/80">
        {isAdding ? (
          <form onSubmit={handleCreateTask} className="space-y-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Solve 2 LeetCode problems on Arrays"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-gray-950 border border-indigo-400 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTaskTitle.trim() || isSubmitting}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all disabled:opacity-50"
              >
                Add to Today
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-slate-300 dark:border-gray-700 hover:border-indigo-500 text-xs font-medium text-slate-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Custom Daily Goal</span>
          </button>
        )}
      </div>
    </div>
  );
}
