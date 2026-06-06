import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { Role } from '@prisma/client';

// Routes that require authentication
const PROTECTED_PREFIXES = ['/dashboard', '/portal', '/api/crm', '/api/sales', '/api/marketing', '/api/client', '/api/billing', '/api/analytics'];

// Public routes (no auth needed)
const PUBLIC_ROUTES = ['/', '/api/health', '/api/auth/login', '/api/auth/register', '/api/auth/logout'];

// Role-based route restrictions
const ROLE_RESTRICTIONS: Record<string, Role[]> = {
  '/dashboard': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES, Role.MARKETING],
  '/dashboard/analytics': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  '/dashboard/billing': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  '/dashboard/settings': [Role.SUPER_ADMIN, Role.ADMIN],
  '/dashboard/security': [Role.SUPER_ADMIN, Role.ADMIN],
  '/portal': [Role.CLIENT, Role.SUPER_ADMIN, Role.ADMIN],
  '/api/crm': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES],
  '/api/marketing': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.MARKETING],
  '/api/billing': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.CLIENT],
  '/api/analytics': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
};

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith('/api/auth/'));
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
}

function getRoleRestriction(pathname: string): Role[] | null {
  const match = Object.entries(ROLE_RESTRICTIONS)
    .filter(([path]) => pathname.startsWith(path))
    .sort((a, b) => b[0].length - a[0].length)[0];
  return match ? match[1] : null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) return NextResponse.next();

  // Check if route needs auth
  if (!isProtectedRoute(pathname)) return NextResponse.next();

  // Get token from cookie or Authorization header
  const token = req.cookies.get('4ucs_token')?.value
    ?? req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Verify token
  const session = await verifyToken(token);
  if (!session) {
    if (pathname.startsWith('/api/')) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Role restriction check
  const allowedRoles = getRoleRestriction(pathname);
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    if (pathname.startsWith('/api/')) {
      return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
    }
    const url = req.nextUrl.clone();
    url.pathname = session.role === Role.CLIENT ? '/portal' : '/dashboard';
    return NextResponse.redirect(url);
  }

  // Inject user info into request headers for API routes
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', session.userId);
  requestHeaders.set('x-user-role', session.role);
  requestHeaders.set('x-user-email', session.email);
  if (session.clientId) requestHeaders.set('x-client-id', session.clientId);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|fonts|images).*)',
  ],
};
