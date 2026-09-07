'use client';

import React, { useState } from 'react';
import { TargetRole } from '@/types';
import {
  Layout,
  Server,
  Layers,
  Coffee,
  Terminal,
  BarChart3,
  BrainCircuit,
  Cpu,
  Check,
  X,
} from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  currentRole: TargetRole;
  onClose: () => void;
  onSelectRole: (role: TargetRole) => Promise<void>;
}

const ROLES: { name: TargetRole; icon: any; desc: string; topicsCount: number }[] = [
  { name: 'Frontend Developer', icon: Layout, desc: 'HTML/CSS, JavaScript, React, Web APIs, Production Deployment', topicsCount: 82 },
  { name: 'Backend Developer', icon: Server, desc: 'Node.js, Express, SQL/Mongo Databases, Auth & System Design', topicsCount: 42 },
  { name: 'Full Stack Developer', icon: Layers, desc: 'Complete Client & Server Integration, Full Capstones', topicsCount: 36 },
  { name: 'Java Developer', icon: Coffee, desc: 'Core Java, Collections, Multithreading, Spring Boot & JPA', topicsCount: 26 },
  { name: 'Python Developer', icon: Terminal, desc: 'Pythonic Coding, FastAPI / Django, Testing & Deployment', topicsCount: 22 },
  { name: 'Data Analyst', icon: BarChart3, desc: 'Excel, SQL Queries, Pandas, Power BI & Tableau Dashboards', topicsCount: 26 },
  { name: 'Data Scientist', icon: BrainCircuit, desc: 'Math & Stats, EDA, Scikit-Learn ML, Deep Learning Pipelines', topicsCount: 22 },
  { name: 'DevOps Engineer', icon: Cpu, desc: 'Linux CLI, Docker, Kubernetes, CI/CD Actions & Cloud Infra', topicsCount: 20 },
];

export default function RoleSwitcherModal({
  isOpen,
  currentRole,
  onClose,
  onSelectRole,
}: RoleSwitcherModalProps) {
  const [selectedRole, setSelectedRole] = useState<TargetRole>(currentRole);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSelectRole(selectedRole);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-6 shadow-2xl relative max-h-[90vh] flex flex-col transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-800 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Switch Target Placement Role</h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              Select your target career track. Your learning history in all roles is safely preserved.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto py-2 pr-1 custom-scrollbar">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.name;

            return (
              <div
                key={r.name}
                onClick={() => setSelectedRole(r.name)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-slate-900 dark:text-white shadow-md'
                    : 'bg-slate-50/70 dark:bg-gray-950/60 hover:bg-slate-100 dark:hover:bg-gray-800 border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-400'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{r.name}</h4>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        {r.topicsCount} Topics & Milestones
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {r.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-gray-800 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-xs font-semibold text-slate-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Switching...' : `Set as Target Role (${selectedRole})`}
          </button>
        </div>
      </div>
    </div>
  );
}
