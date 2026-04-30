import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = req.nextUrl.pathname;

  // Redirige vers /login si non authentifié
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Bloque les AGENT sur les routes /admin
  if (path.startsWith('/admin') && token.role === 'AGENT') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/patients/:path*',
    '/consultations/:path*',
    '/profil/:path*',
    '/admin/:path*',
  ],
};
