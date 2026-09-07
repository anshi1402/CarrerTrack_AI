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

export function getCurrentUserFromRequest(request: NextRequest): User | null {
  try {
    // 1. Check cookies
    const cookieToken = request.cookies.get('careertrack_token')?.value;
    // 2. Check Authorization header
    const authHeader = request.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const token = cookieToken || headerToken;
    if (!token) {
      // Return default demo user for frictionless local preview if no token
      return dbRepo.getUserById('demo-user-id') || null;
    }

    const payload = verifyToken(token);
    if (!payload?.userId) {
      return dbRepo.getUserById('demo-user-id') || null;
    }

    const user = dbRepo.getUserById(payload.userId);
    return user || dbRepo.getUserById('demo-user-id') || null;
  } catch {
    return dbRepo.getUserById('demo-user-id') || null;
  }
}
