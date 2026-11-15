import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/server/auth';

export const dynamic = 'force-dynamic';

// Lets the client confirm its remembered login still has a valid server session
export async function GET(request: NextRequest) {
  const username = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!username) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: { username } }, { status: 200 });
}
