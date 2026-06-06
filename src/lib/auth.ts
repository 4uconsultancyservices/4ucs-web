import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { Role } from '@prisma/client';
import { hasPermission, Permission, PermissionError } from './rbac';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-in-production-32chars'
);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  clientId?: string;
}

// ── Token creation ────────────────────────────────────────
export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

// ── Token verification ────────────────────────────────────
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ── Get session from cookies (Server Components) ──────────
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('4ucs_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ── Get session from request (API Routes) ────────────────
export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  // Check Authorization header first
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return verifyToken(authHeader.slice(7));
  }
  // Fallback to cookie
  const token = req.cookies.get('4ucs_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ── Require authentication (throws on failure) ────────────
export async function requireAuth(req: NextRequest): Promise<SessionPayload> {
  const session = await getSessionFromRequest(req);
  if (!session) {
    throw new AuthError('Authentication required');
  }
  return session;
}

// ── Require specific permission ───────────────────────────
export async function requireAuthAndPermission(
  req: NextRequest,
  permission: Permission
): Promise<SessionPayload> {
  const session = await requireAuth(req);
  if (!hasPermission(session.role, permission)) {
    throw new PermissionError(`Insufficient permissions for: ${permission}`);
  }
  return session;
}

// ── Error classes ─────────────────────────────────────────
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// ── Standard API response helpers ────────────────────────
export function unauthorized(message = 'Authentication required') {
  return Response.json({ error: message }, { status: 401 });
}

export function forbidden(message = 'Insufficient permissions') {
  return Response.json({ error: message }, { status: 403 });
}

export function badRequest(message: string, errors?: Record<string, string[]>) {
  return Response.json({ error: message, ...(errors && { errors }) }, { status: 400 });
}

export function notFound(resource = 'Resource') {
  return Response.json({ error: `${resource} not found` }, { status: 404 });
}

export function serverError(message = 'Internal server error') {
  return Response.json({ error: message }, { status: 500 });
}

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return Response.json({ data, ...(meta && { meta }) }, { status: 200 });
}

export function created<T>(data: T) {
  return Response.json({ data }, { status: 201 });
}

export function noContent() {
  return new Response(null, { status: 204 });
}

// ── Handle route errors uniformly ────────────────────────
export function handleRouteError(error: unknown): Response {
  if (error instanceof AuthError)      return unauthorized(error.message);
  if (error instanceof PermissionError) return forbidden(error.message);
  console.error('[Route Error]', error);
  return serverError();
}
