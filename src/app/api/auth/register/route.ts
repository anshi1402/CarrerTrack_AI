import { NextRequest, NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { User, TargetRole } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, targetRole } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = await dbRepo.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      name,
      email,
      password: hashedPassword,
      targetRole: (targetRole as TargetRole) || 'Frontend Developer',
      skillLevel: 'Beginner',
      dailyGoalTarget: 3,
      reminderTime: '20:00',
      notificationPreferences: {
        dailyGoalReminder: true,
        streakReminder: true,
        achievementNotifications: true,
        weeklyProgressSummary: true,
        browserNotifications: false,
        reminderTime: '20:00',
      },
      currentStreak: 0,
      longestStreak: 0,
      readinessScore: 0,
      completedTopicsCount: 0,
      completedProjectsCount: 0,
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
    };

    await dbRepo.createUser(newUser);

    const token = signToken({ userId: newUser.id, email: newUser.email });
    const { password: _, ...safeUser } = newUser;

    const response = NextResponse.json({ success: true, user: safeUser, token });
    response.cookies.set('careertrack_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
