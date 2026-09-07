'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl border transition-all duration-200 flex items-center justify-center ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-800 text-amber-300 hover:text-amber-200 hover:bg-gray-800'
          : 'bg-gray-100 border-gray-300 text-indigo-600 hover:text-indigo-700 hover:bg-gray-200 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4.5 w-4.5 animate-in spin-in-180 duration-300" />
      ) : (
        <Moon className="h-4.5 w-4.5 animate-in spin-in-180 duration-300" />
      )}
    </button>
  );
}
