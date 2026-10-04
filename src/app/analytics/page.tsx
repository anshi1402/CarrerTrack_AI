'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Target,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import ReadinessGauge from '@/components/ReadinessGauge';
import { useRouter } from 'next/navigation';
import { User, AnalyticsSummary } from '@/types';
import { useTheme } from '@/components/ThemeProvider';
import { getAuthHeaders } from '@/lib/client-auth';

export default function AnalyticsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const userRes = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const userData = await userRes.json();
      if (userData.success && userData.user) {
        setUser(userData.user);
      } else {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/analytics', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.summary);
      }
    } catch {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const weeklyData = analytics?.weeklyActivity || [];
  const monthlyData = analytics?.monthlyTrends || [];
  const skillData = analytics?.skillProgress || [];

  const gridStroke = theme === 'dark' ? '#1F2937' : '#E2E8F0';
  const axisStroke = theme === 'dark' ? '#9CA3AF' : '#64748B';
  const tooltipBg = theme === 'dark' ? '#111827' : '#FFFFFF';
  const tooltipBorder = theme === 'dark' ? '#374151' : '#CBD5E1';
  const tooltipText = theme === 'dark' ? '#F3F4F6' : '#0F172A';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex flex-col transition-colors duration-200">
      <Navbar user={user} />

      <div className="flex-1 flex w-full">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            {/* Header Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-purple-50 dark:from-purple-950/40 via-white dark:via-gray-900 to-indigo-50 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-500/20 p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                    Performance Intelligence
                  </span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                    Weekly Consistency: {analytics?.weeklyConsistencyRate}%
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Study Analytics & Consistency Index
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1 max-w-2xl leading-relaxed">
                  Real-time metrics tracking your daily learning velocity, skill mastery percentages, and placement readiness growth.
                </p>
              </div>

              {/* Stats Highlights */}
              <div className="flex items-center gap-4 bg-white dark:bg-gray-950/80 border border-slate-200 dark:border-gray-800 p-4 rounded-2xl shrink-0 shadow-sm">
                <div>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {analytics?.totalTopicsCompleted || 28}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-gray-400 block font-bold uppercase">
                    Topics Mastered
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-gray-800"></div>
                <div>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {user?.currentStreak || 12}d
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-gray-400 block font-bold uppercase">
                    Current Streak
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Readiness Gauge */}
          <div className="mt-6">
            <ReadinessGauge
              report={analytics?.readinessReport}
              score={user?.readinessScore}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Weekly Activity Bar Chart */}
            <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-xl transition-colors duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Weekly Topics Completed</h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">Last 7 Days</span>
              </div>

              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="dayOfWeek" stroke={axisStroke} fontSize={12} tickLine={false} />
                    <YAxis stroke={axisStroke} fontSize={12} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        color: tooltipText,
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Bar
                      dataKey="topicsCompleted"
                      name="Topics"
                      fill="#6366F1"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Learning Trajectory Area Chart */}
            <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-xl transition-colors duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cumulative Monthly Trajectory</h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">6 Months Trend</span>
              </div>

              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="month" stroke={axisStroke} fontSize={12} tickLine={false} />
                    <YAxis stroke={axisStroke} fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        color: tooltipText,
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completedCount"
                      name="Total Topics"
                      stroke="#10B981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorTrend)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Skill-wise Progress Breakdown */}
          <div className="mt-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-xl transition-colors duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Curriculum Section Mastery Breakdown
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                {user?.targetRole}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillData.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800/80 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white mb-2">
                    <span className="truncate pr-2">{skill.skill}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{skill.percentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
                    <span>{skill.completed} of {skill.total} Completed</span>
                    <span>{skill.total - skill.completed} Remaining</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>

      <MobileNav />
    </div>
  );
}
