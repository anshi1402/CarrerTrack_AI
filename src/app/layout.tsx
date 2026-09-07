import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'CareerTrack AI — Placement Preparation & Learning Management OS',
  description:
    'Role-based placement roadmaps, interactive milestone tracking, habit-based learning streaks, daily goals, and placement readiness score analytics for engineering & degree students.',
  keywords: [
    'placement preparation',
    'career roadmap',
    'frontend developer roadmap',
    'backend developer roadmap',
    'full stack roadmap',
    'learning streaks',
    'habit tracker',
    'placement readiness score',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F19] dark:text-[#F3F4F6] transition-colors duration-200 antialiased selection:bg-indigo-500 selection:text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
