import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

// Define allowed paths for each role
const ROLE_PATHS = {
  admin: ['/admin', '/programare', '/programari', '/profile'],
  barber: ['/programare', '/programari', '/profile'],
  user: ['/programare', '/profile'],
};

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Redirect to sign-in if no session
  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  const { pathname } = request.nextUrl;

  // Check if user has permission to access the path
  const hasPermission = session.user.roles.some(role => 
    ROLE_PATHS[role as keyof typeof ROLE_PATHS]?.some(path => pathname.startsWith(path))
  );

  if (!hasPermission) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/programare/:path*', '/admin/:path*', '/programari/:path*'],
};