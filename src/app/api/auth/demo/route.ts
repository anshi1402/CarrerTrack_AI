import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Demo mode has been disabled. Please register or sign in with your student account.' },
    { status: 404 }
  );
}
