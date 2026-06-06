import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { ok, badRequest, handleRouteError, requireAuthAndPermission } from '@/lib/auth';
import { RegisterSchema } from '@/lib/validations';

// POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    // Only admins can register users (or allow open registration by removing auth check)
    await requireAuthAndPermission(req, 'users:create');

    const body   = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { name, email, password, role } = parsed.data;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return badRequest('Email already registered');

    const hashed = await bcrypt.hash(password, 12);
    const user   = await prisma.user.create({
      data:   { name, email, password: hashed, role: role ?? 'CLIENT' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return ok(user);
  } catch (error) {
    return handleRouteError(error);
  }
}
