import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  checkCredentials,
  createSessionToken,
  isAuthConfigured,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_FAILED_ATTEMPTS = 10;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

// Per-process only: slows password guessing, resets when the app restarts
const failedAttempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

export async function POST(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Login is not configured on the server' },
      { status: 500 }
    );
  }

  const key = clientKey(request);
  const now = Date.now();
  const record = failedAttempts.get(key);
  if (record && record.resetAt > now && record.count >= MAX_FAILED_ATTEMPTS) {
    return NextResponse.json(
      { success: false, error: 'Too many failed attempts. Try again later.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!checkCredentials(username, password)) {
    const current = record && record.resetAt > now ? record : { count: 0, resetAt: now + LOCKOUT_WINDOW_MS };
    failedAttempts.set(key, { count: current.count + 1, resetAt: current.resetAt });
    return NextResponse.json(
      { success: false, error: 'Invalid username or password' },
      { status: 401 }
    );
  }

  failedAttempts.delete(key);

  const response = NextResponse.json({ success: true, data: { username } }, { status: 200 });
  response.cookies.set(SESSION_COOKIE, createSessionToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
