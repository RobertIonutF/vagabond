import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './auth'
import prisma from './lib/prisma'
import { signOut } from 'next-auth/react'

export async function middleware(request: NextRequest) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  if (!session.user.id) {
    console.error('User authenticated but ID is missing')
    return NextResponse.next()
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roles: true, permissions: true }
    })

    if (!user) {
      await signOut()

      console.error('User not found in database')
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    } 

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-roles', user.roles.join(','))
    requestHeaders.set('x-user-permissions', user.permissions.join(','))

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/programare/:path*', '/profile/:path*', '/admin/:path*', '/programari/:path*'],
}