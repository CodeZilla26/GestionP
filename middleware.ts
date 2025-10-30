import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const PROTECTED_PATHS = [
  '/dashboard',
  '/projects',
  '/tasks',
  '/team',
  '/reports',
  '/settings',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir siempre rutas públicas y API
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password')
  ) {
    return NextResponse.next();
  }

  // Si la ruta es protegida y no hay cookie de auth, redirigir a login
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected) {
    const authCookie = req.cookies.get('auth')?.value;
    if (!authCookie) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|favicon|api).*)',
  ],
};
