import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

// In-memory cache for user sessions
const sessionCache = new Map<string, { session: any, expires: Date }>();

const ROLE_PATHS = new Map<string, Set<string>>([
  ['admin', new Set(['/admin', '/programare', '/programari', '/profile'])],
  ['barber', new Set(['/programare', '/programari', '/profile'])],
  ['user', new Set(['/programare', '/profile'])],
]);

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('sessionId')?.value;

  let session;
  if (sessionId && sessionCache.has(sessionId)) {
    const cached = sessionCache.get(sessionId);
    if (cached && new Date() < new Date(cached.expires)) {
      session = cached.session;
    } else {
      sessionCache.delete(sessionId);
    }
  }

  if (!session) {
    session = await auth();
    if (sessionId) {
      sessionCache.set(sessionId, { session, expires: new Date(session?.expires as string) });
    }
  }

  // Redirect to sign-in if no session
  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  const { pathname } = request.nextUrl;

  // Check if user has permission to access the path
  const hasPermission = session.user.roles.some((role: string) => {
    const allowedPaths = ROLE_PATHS.get(role);
    return allowedPaths && Array.from(allowedPaths).some(path => pathname.startsWith(path));
  });

  if (!hasPermission) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/programare/:path*', '/admin/:path*', '/programari/:path*'],
};