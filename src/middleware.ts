import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;
    if (path.startsWith('/admin') && role === 'AGENT') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  },
  {
    callbacks: {
	     authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/patients',
    '/patients/:path*',
    '/consultations',
    '/consultations/:path*',
    '/profil',
    '/profil/:path*',
    '/admin/:path*',
  ],
};
