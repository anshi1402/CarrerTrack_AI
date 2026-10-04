'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Flame,
  Award,
  Clock,
  Send,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { useRouter } from 'next/navigation';
import { User, UserNotification } from '@/types';
import { getAuthHeaders } from '@/lib/client-auth';

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'reminders' | 'milestones'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    fetchData();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  const fetchData = async () => {
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

      const notifRes = await fetch('/api/notifications', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const notifData = await notifRes.json();
      if (notifData.success) {
        setNotifications(notifData.notifications || []);
        setUnreadCount(notifData.unreadCount || 0);
      }
    } catch {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(0);
      }
    } catch {
      // ignore
    }
  };

  const handleTriggerTest = async (type: 'daily' | 'streak_risk') => {
    setIsTesting(true);
    try {
      const res = await fetch('/api/notifications/trigger', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);

        if (browserPermission === 'granted' && typeof window !== 'undefined' && 'Notification' in window) {
          new Notification(type === 'streak_risk' ? '🔥 Streak at Risk!' : '📚 Daily Goal Reminder', {
            body: type === 'streak_risk'
              ? 'Complete today\'s goal before midnight to keep your streak alive!'
              : 'You have tasks left in your placement roadmap for today!',
            icon: '/favicon.ico',
          });
        }
      }
    } catch {
      // ignore
    } finally {
      setIsTesting(false);
    }
  };

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      setBrowserPermission(perm);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'reminders') return n.type === 'daily_reminder' || n.type === 'streak_risk';
    if (activeFilter === 'milestones') return n.type === 'milestone' || n.type === 'goal_completed';
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white flex flex-col transition-colors duration-200">
      <Navbar user={user} />

      <div className="flex-1 flex w-full">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            {/* Header Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-indigo-50 dark:from-indigo-950/60 via-purple-50 dark:via-purple-950/40 to-white dark:to-gray-900 border border-indigo-200 dark:border-indigo-900/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                    Habit & Goal Alerts
                  </span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                    Scheduled Time: {user?.reminderTime || '20:00'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Notification Center
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1 max-w-2xl leading-relaxed">
                  Real-time alerts, streak protection reminders, and milestone achievement announcements.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 hover:bg-slate-100 dark:hover:bg-gray-800 border border-slate-200 dark:border-gray-700 text-xs font-semibold text-slate-700 dark:text-gray-300 transition-all shadow-sm"
                  >
                    Mark All Read
                  </button>
                )}

                <button
                  onClick={() => handleTriggerTest('daily')}
                  disabled={isTesting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Test Reminder</span>
                </button>
              </div>
            </div>
          </div>

          {/* Browser Notification Banner */}
          {browserPermission !== 'granted' && (
            <div className="mt-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Enable Browser Push Notifications</h4>
                  <p className="text-[11px] text-slate-600 dark:text-gray-400">
                    Receive daily goal and streak alerts directly on your device before your streak resets.
                  </p>
                </div>
              </div>
              <button
                onClick={requestBrowserPermission}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shrink-0 self-start sm:self-auto"
              >
                Allow Notifications
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 overflow-x-auto shadow-sm">
              {[
                { id: 'all', label: `All (${notifications.length})` },
                { id: 'unread', label: `Unread (${unreadCount})` },
                { id: 'reminders', label: 'Goal Reminders' },
                { id: 'milestones', label: 'Milestones' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeFilter === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleTriggerTest('streak_risk')}
              className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 font-semibold flex items-center gap-1 shrink-0"
            >
              <Flame className="h-3.5 w-3.5 fill-amber-500 dark:fill-amber-400" />
              <span>Simulate Streak Alert</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="mt-6 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-12 text-center shadow-sm">
                <Bell className="mx-auto h-10 w-10 text-slate-300 dark:text-gray-600 mb-3" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-gray-300">No notifications in this tab</h3>
                <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
                  You are all caught up with your placement roadmap updates!
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const isMilestone = notif.type === 'milestone' || notif.type === 'goal_completed';
                const isStreakRisk = notif.type === 'streak_risk';

                return (
                  <div
                    key={notif.id}
                    className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                      !notif.read
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/25 border-indigo-200 dark:border-indigo-800/50 shadow-sm'
                        : 'bg-white dark:bg-gray-900/60 border-slate-200 dark:border-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                          isStreakRisk
                            ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/30 text-amber-600 dark:text-amber-400'
                            : isMilestone
                            ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {isStreakRisk ? (
                          <Flame className="h-5 w-5 fill-amber-500 dark:fill-amber-400" />
                        ) : isMilestone ? (
                          <Award className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {notif.title}
                            {!notif.read && (
                              <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                            )}
                          </h4>
                          <span className="text-[11px] text-slate-400 dark:text-gray-500 shrink-0">
                            {new Date(notif.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-normal">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>

      <MobileNav />
    </div>
  );
}
