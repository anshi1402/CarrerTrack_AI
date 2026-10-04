import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { dbRepo } from './db';
import { User } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'careertrack-ai-super-secret-key-2026';

export interface TokenPayload {
  userId: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUserFromRequest(request: NextRequest): Promise<User | null> {
  try {
    // 1. Check cookies
    const cookieToken = request.cookies.get('careertrack_token')?.value;
    // 2. Check Authorization header
    const authHeader = request.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const token = cookieToken || headerToken;
    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload?.userId) {
      return null;
    }

    const user = await dbRepo.getUserById(payload.userId);
    return user || null;
  } catch {
    return null;
  }
}
