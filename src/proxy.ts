import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

// Reachable without a session: the login page and the endpoints that create or clear one
const PUBLIC_PATHS = new Set(['/login', '/api/auth/login', '/api/auth/logout']);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (user) {
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  // Everything except Next's build assets and the public images the login page needs
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
