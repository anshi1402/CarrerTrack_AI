'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, CheckSquare, BarChart3, User } from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Roadmap', href: '/roadmap', icon: Map },
  { name: 'Goals', href: '/goals', icon: CheckSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B0F19]/95 border-t border-slate-200 dark:border-gray-800 backdrop-blur-xl px-2 py-2 transition-colors duration-200">
      <div className="flex items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'scale-110 text-indigo-600 dark:text-indigo-400' : ''}`} />
              <span className="text-[10px] mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
