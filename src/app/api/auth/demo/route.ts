import { NextResponse } from 'next/server';
import { dbRepo } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST() {
  try {
    const demoUser = dbRepo.getUserById('demo-user-id');
    if (!demoUser) {
      return NextResponse.json({ error: 'Demo user not found' }, { status: 404 });
    }

    const token = signToken({ userId: demoUser.id, email: demoUser.email });
    const { password: _, ...safeUser } = demoUser;

    const response = NextResponse.json({ success: true, user: safeUser, token });
    response.cookies.set('careertrack_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Demo login failed' }, { status: 500 });
  }
}
