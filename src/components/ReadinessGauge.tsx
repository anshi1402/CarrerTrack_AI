'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PlacementReadinessReport } from '@/types';

interface ReadinessGaugeProps {
  report?: PlacementReadinessReport | null;
  score?: number;
}

export default function ReadinessGauge({ report, score: fallbackScore }: ReadinessGaugeProps) {
  const score = report?.score ?? fallbackScore ?? 74;
  const level = report?.level ?? (score > 80 ? 'Highly Prepared' : score > 60 ? 'Placement Ready Path' : score > 40 ? 'Developing Skills' : 'Building Foundation');
  const levelDesc = report?.levelDescription ?? 'You are steadily building placement-ready competencies across all foundational and practical domains.';

  const getTheme = () => {
    if (score >= 80) return { stroke: '#10B981', text: 'text-emerald-600 dark:text-emerald-400', bg: 'from-emerald-500/10 to-teal-500/5', border: 'border-emerald-500/30' };
    if (score >= 60) return { stroke: '#6366F1', text: 'text-indigo-600 dark:text-indigo-400', bg: 'from-indigo-500/10 to-purple-500/5', border: 'border-indigo-500/30' };
    if (score >= 40) return { stroke: '#F59E0B', text: 'text-amber-600 dark:text-amber-400', bg: 'from-amber-500/10 to-orange-500/5', border: 'border-amber-500/30' };
    return { stroke: '#EC4899', text: 'text-rose-600 dark:text-rose-400', bg: 'from-rose-500/10 to-pink-500/5', border: 'border-rose-500/30' };
  };

  const theme = getTheme();
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.bg} bg-white dark:bg-gray-900 border ${theme.border} p-6 shadow-xl transition-colors duration-200`}>
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`h-5 w-5 ${theme.text}`} />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Placement Readiness Index
          </h3>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-gray-950/60 border ${theme.border} ${theme.text}`}>
          {level}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Circular Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-200 dark:stroke-gray-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress Stroke */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={theme.stroke}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Centered Score */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{score}%</span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                Readiness
              </span>
            </div>
          </div>
        </div>

        {/* Readiness Insights & Breakdown */}
        <div className="md:col-span-8 space-y-3">
          <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed font-medium">
            {levelDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Strong Areas */}
            <div className="rounded-2xl bg-emerald-50/50 dark:bg-gray-950/60 border border-emerald-200 dark:border-emerald-900/40 p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Strong Foundation Areas</span>
              </div>
              <div className="space-y-1">
                {(report?.strongAreas && report.strongAreas.length > 0
                  ? report.strongAreas
                  : ['Web Fundamentals', 'HTML & Forms', 'CSS & Flexbox', 'Core JavaScript']
                ).map((area, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-gray-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                    <span className="truncate">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Improvement */}
            <div className="rounded-2xl bg-amber-50/50 dark:bg-gray-950/60 border border-amber-200 dark:border-amber-900/40 p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Recommended Focus Areas</span>
              </div>
              <div className="space-y-1">
                {(report?.needsImprovement && report.needsImprovement.length > 0
                  ? report.needsImprovement
                  : ['React State Batching', 'API Integration', 'Full Stack Project', 'Frontend DSA']
                ).map((area, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-gray-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400"></span>
                    <span className="truncate">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
