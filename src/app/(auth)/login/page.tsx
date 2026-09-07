'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Sparkles, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      router.push('/dashboard');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[550px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-gray-950">
              <Compass className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <span className="text-xl font-extrabold text-white">
            CareerTrack<span className="text-indigo-400">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-black tracking-tight text-white">
          Welcome back, Student 👋
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Sign in to resume your roadmap and keep your daily learning streak alive.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="rounded-3xl bg-gray-900 border border-gray-800 p-6 sm:p-8 shadow-2xl">
          {/* 1-Click Quick Demo Login Pill */}
          <div className="mb-6 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center">
            <p className="text-xs text-indigo-300 font-medium mb-2">
              Want to test the app right away?
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isDemoLoading}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isDemoLoading ? 'Launching Demo...' : '1-Click Quick Demo Login'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-800 w-full"></div>
            <span className="bg-gray-900 px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Or sign in with email
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 mt-2"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Create account free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
