'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  Flame,
  Layout,
  Server,
  Layers,
  Coffee,
  Terminal,
  BarChart3,
  BrainCircuit,
  Cpu,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const ROLES_PREVIEW = [
  { name: 'Frontend Developer', icon: Layout, topics: 82, color: 'from-indigo-500 to-blue-600', badge: 'High Demand' },
  { name: 'Backend Developer', icon: Server, topics: 42, color: 'from-emerald-500 to-teal-600', badge: 'Core Engineering' },
  { name: 'Full Stack Developer', icon: Layers, topics: 36, color: 'from-purple-500 to-indigo-600', badge: 'Most Popular' },
  { name: 'Java Developer', icon: Coffee, topics: 26, color: 'from-amber-500 to-orange-600', badge: 'Enterprise Standard' },
  { name: 'Python Developer', icon: Terminal, topics: 22, color: 'from-cyan-500 to-blue-600', badge: 'Fast Track' },
  { name: 'Data Analyst', icon: BarChart3, topics: 26, color: 'from-rose-500 to-pink-600', badge: 'BI & SQL' },
  { name: 'Data Scientist', icon: BrainCircuit, topics: 22, color: 'from-violet-500 to-purple-600', badge: 'AI & ML' },
  { name: 'DevOps Engineer', icon: Cpu, topics: 20, color: 'from-teal-500 to-emerald-600', badge: 'Cloud & CI/CD' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-gray-800/80 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-900 dark:bg-gray-950">
                <Compass className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              CareerTrack<span className="bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <Link
              href="/login"
              className="text-xs font-medium text-slate-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white px-2.5 py-1.5"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-emerald-500/10 blur-[140px] pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>All-In-One Placement Preparation Operating System</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
              Track Skills. Stay Consistent.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 dark:from-indigo-400 dark:via-purple-300 dark:to-emerald-400 bg-clip-text text-transparent">
                Become Placement Ready.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
              No more scattered YouTube playlists, messy spreadsheets, or broken study schedules. Follow structured role-based roadmaps, build daily learning streaks, and evaluate your placement readiness with precision analytics.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-sm font-bold text-white shadow-xl shadow-indigo-600/40 hover:shadow-indigo-600/60 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Start Your Placement Journey</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-gray-900/80 hover:bg-slate-100 dark:hover:bg-gray-800 border border-slate-300 dark:border-gray-700 text-sm font-bold text-slate-700 dark:text-gray-200 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Sign In to Account</span>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-gray-800/80">
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">8+</div>
                <div className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-medium">Curated Role Roadmaps</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400">🔥 Daily Habit</div>
                <div className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-medium">Streak Consistency Engine</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">100%</div>
                <div className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-medium">Interactive Checklists</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">0–100%</div>
                <div className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-medium">Placement Readiness Index</div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-16 bg-slate-100/70 dark:bg-gray-950/60 border-t border-b border-slate-200 dark:border-gray-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                Unified Learning Ecosystem
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Everything You Need To Clear Campus Placements
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Role Roadmaps */}
              <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 hover:border-indigo-500/40 transition-all group shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                  <Layout className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Structured Role Roadmaps</h4>
                <p className="mt-2 text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
                  Step-by-step milestones covering core fundamentals, frameworks, database integration, capstone projects, and interview questions for 8+ tech roles.
                </p>
              </div>

              {/* Feature 2: Habit Streak */}
              <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 hover:border-amber-500/40 transition-all group shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                  <Flame className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Habit Streak Engine</h4>
                <p className="mt-2 text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
                  Habit-based daily streaks and progress bars that gamify consistency and prevent students from giving up halfway through their preparation.
                </p>
              </div>

              {/* Feature 3: Readiness Score */}
              <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 hover:border-emerald-500/40 transition-all group shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Placement Readiness Score</h4>
                <p className="mt-2 text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
                  Multi-signal algorithmic readiness index combining roadmap completion, daily consistency, DSA questions, and real projects with focus recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Explorer Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                  Role Catalog
                </h2>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Choose Your Target Placement Track
                </h3>
              </div>
              <Link
                href="/register"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 group"
              >
                <span>Explore full curricula in workspace</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ROLES_PREVIEW.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.name}
                    className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 hover:border-indigo-400 dark:hover:border-gray-700 transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
                          {role.badge}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {role.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-medium">
                        {role.topics} Structured Milestones
                      </p>
                    </div>

                    <Link
                      href={`/register?role=${encodeURIComponent(role.name)}`}
                      className="mt-4 pt-3 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    >
                      <span>Start Roadmap</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-[#0B0F19] py-8 text-center text-xs text-slate-500 dark:text-gray-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CareerTrack AI. Built for engineering & degree students.</p>
          <div className="flex items-center gap-4 text-slate-600 dark:text-gray-400">
            <Link href="/login" className="hover:text-indigo-600 dark:hover:text-white">Sign In</Link>
            <Link href="/register" className="hover:text-indigo-600 dark:hover:text-white">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
