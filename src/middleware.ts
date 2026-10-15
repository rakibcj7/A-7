import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
             const signinUrl = new URL('/signin', request.url);
    signinUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    signinUrl.searchParams.set('reason', 'required');
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/product/:path*'],
};
