import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';
import prisma from './lib/prisma';

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin') || pathname.startsWith('/programare')) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true, permissions: true },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-roles', user.roles.join(','));
    requestHeaders.set('x-user-permissions', user.permissions.join(','));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/programare/:path*', '/profile/:path*', '/admin/:path*', '/programari/:path*'],
};