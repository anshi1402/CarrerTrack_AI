'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Check,
  ArrowRight,
  ArrowLeft,
  Layout,
  Server,
  Layers,
  Coffee,
  Terminal,
  BarChart3,
  BrainCircuit,
  Cpu,
  Clock,
  Target,
  Sparkles,
  Bell,
} from 'lucide-react';
import { TargetRole, SkillLevel } from '@/types';
import { fireCelebrationConfetti } from '@/components/ConfettiTrigger';

const ROLES: { name: TargetRole; icon: any; desc: string; topics: number }[] = [
  { name: 'Frontend Developer', icon: Layout, desc: 'HTML/CSS, JavaScript, React, Web APIs & Frontend Architecture', topics: 82 },
  { name: 'Backend Developer', icon: Server, desc: 'Node.js, Express, SQL/Mongo, REST APIs & System Security', topics: 42 },
  { name: 'Full Stack Developer', icon: Layers, desc: 'Complete Client-Server Integration, Full Stack Capstones', topics: 36 },
  { name: 'Java Developer', icon: Coffee, desc: 'Core Java, Collections, Multithreading, Spring Boot & JPA', topics: 26 },
  { name: 'Python Developer', icon: Terminal, desc: 'Pythonic Syntax, FastAPI / Django, Testing & Deployment', topics: 22 },
  { name: 'Data Analyst', icon: BarChart3, desc: 'Excel, SQL Queries, Pandas, Power BI & Tableau Dashboards', topics: 26 },
  { name: 'Data Scientist', icon: BrainCircuit, desc: 'Statistics, EDA, Machine Learning & Model Deployment', topics: 22 },
  { name: 'DevOps Engineer', icon: Cpu, desc: 'Linux CLI, Docker, Kubernetes, CI/CD Actions & Cloud Infra', topics: 20 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [targetRole, setTargetRole] = useState<TargetRole>('Frontend Developer');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Intermediate');
  const [dailyGoalTarget, setDailyGoalTarget] = useState<number>(3);
  const [reminderTime, setReminderTime] = useState<string>('20:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          skillLevel,
          dailyGoalTarget,
          reminderTime,
        }),
      });

      if (res.ok) {
        fireCelebrationConfetti();
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        router.push('/dashboard');
      }
    } catch {
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-3xl mx-auto w-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-gray-950">
              <Compass className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <span className="text-base font-extrabold text-white">
            CareerTrack<span className="text-indigo-400">AI</span>
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-indigo-500'
                  : s < step
                  ? 'w-2 bg-emerald-400'
                  : 'w-2 bg-gray-800'
              }`}
            />
          ))}
          <span className="text-xs font-semibold text-gray-400 ml-2">
            Step {step} of 4
          </span>
        </div>
      </header>

      {/* Main Wizard Content */}
      <main className="max-w-3xl mx-auto w-full my-8 relative z-10">
        <div className="rounded-3xl bg-gray-900 border border-gray-800 p-6 sm:p-8 shadow-2xl">
          {/* STEP 1: TARGET ROLE */}
          {step === 1 && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Step 1 • Career Target
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Which placement role are you preparing for?
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  We will curate an end-to-end learning roadmap specifically tailored to this track.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = targetRole === r.name;

                  return (
                    <div
                      key={r.name}
                      onClick={() => setTargetRole(r.name)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                          : 'bg-gray-950/60 hover:bg-gray-800 border-gray-800 text-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-xl ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-800 text-gray-400'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{r.name}</h4>
                            <span className="text-[10px] text-indigo-400 font-semibold">
                              {r.topics} Milestones
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                        {r.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: CURRENT SKILL LEVEL */}
          {step === 2 && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Step 2 • Current Proficiency
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  What is your current experience level?
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  This helps us calibrate roadmap pacing and placement readiness benchmarks.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { level: 'Beginner' as SkillLevel, title: 'Beginner (Starting fresh)', desc: 'New to coding or just beginning core concepts. Ready to build from step 1.' },
                  { level: 'Intermediate' as SkillLevel, title: 'Intermediate (Know basics)', desc: 'Familiar with basic syntax and projects, looking to master advanced concepts and interview rounds.' },
                  { level: 'Advanced' as SkillLevel, title: 'Advanced (Placement Readying)', desc: 'Experienced in programming, focusing on system integration, capstones, and mock interview prep.' },
                ].map((item) => (
                  <div
                    key={item.level}
                    onClick={() => setSkillLevel(item.level)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                      skillLevel === item.level
                        ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg'
                        : 'bg-gray-950/60 hover:bg-gray-800 border-gray-800 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      {skillLevel === item.level && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: DAILY GOALS TARGET */}
          {step === 3 && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Step 3 • Daily Learning Target
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  How many topics will you complete each day?
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Consistent micro-learning is the fastest way to placement readiness.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { count: 2, title: 'Casual Pace', time: '~45 mins/day', desc: 'Ideal for busy semester schedules with college classes.' },
                  { count: 3, title: 'Recommended Pace', time: '~1.5 hrs/day', desc: 'Optimal consistency for students targeting placement drives.' },
                  { count: 5, title: 'Intense Pace', time: '~3 hrs/day', desc: 'Fast-track preparation for upcoming placement interviews in 30 days.' },
                ].map((item) => (
                  <div
                    key={item.count}
                    onClick={() => setDailyGoalTarget(item.count)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                      dailyGoalTarget === item.count
                        ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg'
                        : 'bg-gray-950/60 hover:bg-gray-800 border-gray-800 text-gray-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-black text-indigo-400">{item.count}</span>
                        <span className="text-[10px] font-semibold text-gray-400">{item.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-gray-400">Daily Tasks</span>
                      {dailyGoalTarget === item.count ? (
                        <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                          <Check className="h-3 w-3" /> Selected
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">Select</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: REMINDER TIME & PREFERENCES */}
          {step === 4 && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Step 4 • Notifications & Habits
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  When do you prefer your daily streak reminder?
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  We will send in-app nudges to protect your streak before the day ends.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800">
                  <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-400" />
                    <span>Preferred Reminder Time</span>
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <Bell className="h-4 w-4 text-indigo-400" />
                    <span>Included Habit Reminders</span>
                  </div>
                  <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                    <li>Daily incomplete tasks reminder at {reminderTime}</li>
                    <li>Streak risk warning if goal is untouched by night</li>
                    <li>Celebratory badge unlock announcements</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="mt-8 pt-5 border-t border-gray-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
              >
                <span>Next Step</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isSubmitting ? 'Personalizing...' : 'Generate Roadmap & Open Workspace'}</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer text */}
      <footer className="max-w-3xl mx-auto w-full text-center text-[11px] text-gray-500 relative z-10">
        You can always change your target role and goals anytime from Settings.
      </footer>
    </div>
  );
}
