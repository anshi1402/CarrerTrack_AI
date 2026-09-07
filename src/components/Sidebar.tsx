'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  CheckSquare,
  BarChart3,
  Bell,
  User,
  Settings,
  Sparkles,
  Flame,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Roadmap', href: '/roadmap', icon: Map },
  { name: 'Daily Goals', href: '/goals', icon: CheckSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile & Badges', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 pt-16 z-30 bg-white/90 dark:bg-[#0B0F19]/90 border-r border-slate-200 dark:border-gray-800 backdrop-blur-xl transition-colors duration-200">
      <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
        {/* Navigation Links */}
        <div className="space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 dark:text-gray-400 uppercase tracking-wider">
            Preparation Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-100 hover:bg-slate-100 dark:hover:bg-gray-800/60'
                }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                  }`}
                />
                <span>{item.name}</span>
                {item.name === 'Daily Goals' && (
                  <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-500"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Motivational Placement Card in Sidebar */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-indigo-50 dark:from-indigo-950/60 via-purple-50 dark:via-purple-950/40 to-white dark:to-gray-900 border border-indigo-200 dark:border-indigo-900/50 p-4 relative overflow-hidden shadow-sm">
          <div className="absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-indigo-500/10 blur-xl"></div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Placement Pro Tip</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
            Students who maintain a <strong>7+ day streak</strong> are 3.4x more likely to clear technical coding rounds.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400 pt-2 border-t border-indigo-200 dark:border-indigo-900/40">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <Flame className="h-3 w-3" /> Stay Consistent
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Daily Goals</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
