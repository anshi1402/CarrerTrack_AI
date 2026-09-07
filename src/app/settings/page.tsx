'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Bell,
  Clock,
  Target,
  User,
  Save,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [dailyGoalTarget, setDailyGoalTarget] = useState(3);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [prefs, setPrefs] = useState({
    dailyGoalReminder: true,
    streakReminder: true,
    achievementNotifications: true,
    weeklyProgressSummary: true,
    browserNotifications: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setUser(data.settings);
        setName(data.settings.name || '');
        setDailyGoalTarget(data.settings.dailyGoalTarget || 3);
        setReminderTime(data.settings.reminderTime || '20:00');
        if (data.settings.notificationPreferences) {
          setPrefs(data.settings.notificationPreferences);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          dailyGoalTarget,
          reminderTime,
          notificationPreferences: prefs,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedMessage('Settings successfully saved!');
        setTimeout(() => setSavedMessage(''), 4000);
      }
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
    }
  };

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
          <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            {/* Header Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-indigo-50 dark:from-indigo-950/60 via-purple-50 dark:via-purple-950/40 to-white dark:to-gray-900 border border-indigo-200 dark:border-indigo-900/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Preferences & Settings
                </h1>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                  Configure daily study goals, theme mode, reminder schedules, and notification preferences.
                </p>
              </div>
            </div>
          </div>

          {savedMessage && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{savedMessage}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="mt-6 space-y-6">
            {/* Section 1: Appearance & Theme */}
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-xl transition-colors duration-200">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Sun className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Appearance & Theme</span>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                    theme === 'light'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                      : 'bg-slate-50 dark:bg-gray-950 border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400'
                  }`}
                >
                  <Sun className="h-5 w-5 text-amber-500" />
                  <div className="text-left">
                    <span className="text-xs font-bold block">Light Theme</span>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400">Bright, clean daytime interface</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                    theme === 'dark'
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-gray-950 border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400'
                  }`}
                >
                  <Moon className="h-5 w-5 text-indigo-400" />
                  <div className="text-left">
                    <span className="text-xs font-bold block">Dark Theme</span>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400">Sleek, low-contrast night mode</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Section 2: Profile & Identity */}
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-xl transition-colors duration-200">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Account Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1.5">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 text-xs text-slate-500 dark:text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Study Targets */}
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-xl transition-colors duration-200">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Daily Learning Habit Target</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { count: 2, label: '2 Tasks / Day', time: '~45 mins' },
                  { count: 3, label: '3 Tasks / Day (Recommended)', time: '~1.5 hrs' },
                  { count: 5, label: '5 Tasks / Day (Intensive)', time: '~3 hrs' },
                ].map((item) => (
                  <div
                    key={item.count}
                    onClick={() => setDailyGoalTarget(item.count)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      dailyGoalTarget === item.count
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-slate-900 dark:text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-gray-950/60 hover:bg-slate-100 dark:hover:bg-gray-800 border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 block">{item.count}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{item.label}</h4>
                    <span className="text-[11px] text-slate-500 dark:text-gray-400 block mt-0.5">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Notification Preferences */}
            <div className="rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-xl transition-colors duration-200">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Notification & Reminder Preferences</span>
              </h2>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Preferred Reminder Time</h4>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400">
                      When should we notify you if daily tasks are unfinished?
                    </p>
                  </div>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Toggles */}
                {[
                  {
                    key: 'dailyGoalReminder',
                    title: 'Daily Goal Reminder',
                    desc: 'Notify when you have incomplete roadmap topics remaining in today\'s goal.',
                  },
                  {
                    key: 'streakReminder',
                    title: 'Streak at Risk Warning',
                    desc: 'Send an urgent alert if your learning streak is about to reset before midnight.',
                  },
                  {
                    key: 'achievementNotifications',
                    title: 'Achievement Badges & Milestones',
                    desc: 'Congratulate when completing 10, 25, 50 topics or reaching readiness levels.',
                  },
                  {
                    key: 'weeklyProgressSummary',
                    title: 'Weekly Progress Digest',
                    desc: 'Weekly report summarizing consistency rate and areas needing improvement.',
                  },
                ].map((toggle) => (
                  <div
                    key={toggle.key}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-950/60 border border-slate-200 dark:border-gray-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{toggle.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">{toggle.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={(prefs as any)[toggle.key]}
                        onChange={(e) =>
                          setPrefs({ ...prefs, [toggle.key]: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 dark:bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save All Preferences'}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>

      <MobileNav />
    </div>
  );
}
