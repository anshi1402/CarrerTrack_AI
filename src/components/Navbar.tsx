'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Flame,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  Layers,
  CheckCircle2,
  X,
} from 'lucide-react';
import { User, UserNotification } from '@/types';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  user?: User | null;
  onOpenRoleSwitcher?: () => void;
}

export default function Navbar({ user, onOpenRoleSwitcher }: NavbarProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch('/api/notifications/mark-read', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(0);
      }
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-gray-800 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-xl transition-colors duration-200">
      <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-900 dark:bg-gray-950">
                <Compass className="h-5 w-5 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                CareerTrack<span className="bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400 tracking-wider uppercase -mt-1 hidden sm:block">
                Placement Readiness OS
              </span>
            </div>
          </Link>

          {/* Active Role Selector Badge */}
          {user && (
            <button
              onClick={onOpenRoleSwitcher}
              className="ml-2 sm:ml-4 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-indigo-900/40 hover:border-indigo-500/50 hover:bg-slate-200 dark:hover:bg-gray-800/80 transition-all text-xs text-slate-700 dark:text-gray-200 group"
              title="Click to change target role"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span className="font-medium text-slate-700 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white">
                {user.targetRole}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] uppercase font-semibold">
                Switch
              </span>
            </button>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Streak Flame Counter */}
          {user && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 transition-all text-amber-600 dark:text-amber-400 text-xs font-bold shadow-sm animate-pulse-subtle"
              title="Current Daily Goal Streak"
            >
              <Flame className="h-4 w-4 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 animate-bounce" />
              <span>{user.currentStreak} Days</span>
            </Link>
          )}

          {/* Readiness Score Pill */}
          {user && (
            <Link
              href="/analytics"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:border-emerald-500/60 transition-all"
              title="Placement Readiness Score"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>{user.readinessScore || 0}% Ready</span>
            </Link>
          )}

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800/70 transition-all"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg shadow-rose-500/50 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popup Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 dark:text-gray-500 text-xs">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-xl text-xs transition-all ${
                          notif.read
                            ? 'bg-slate-50 dark:bg-gray-950/40 text-slate-600 dark:text-gray-400 border border-slate-100 dark:border-transparent'
                            : 'bg-indigo-50/70 dark:bg-indigo-950/30 text-slate-800 dark:text-gray-200 border border-indigo-200 dark:border-indigo-900/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-slate-900 dark:text-white">{notif.title}</p>
                          <span className="text-[10px] text-slate-400 dark:text-gray-500 shrink-0">
                            {new Date(notif.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-gray-300 leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-gray-800 text-center">
                  <Link
                    href="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    View all in Notification Center →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800/80 transition-all border border-transparent hover:border-slate-200 dark:hover:border-gray-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-gray-300 hidden md:block">
                {user?.name || 'Student'}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-gray-400 hidden md:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-gray-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{user?.name || 'Student'}</p>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>

                <div className="py-1 space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <UserIcon className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                    My Profile & Badges
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                    Preferences & Goals
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-gray-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
