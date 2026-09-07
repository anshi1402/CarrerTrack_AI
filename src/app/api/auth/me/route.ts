import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch user' }, { status: 500 });
  }
}
