import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createToken, ok, badRequest, unauthorized, handleRouteError } from '@/lib/auth';
import { LoginSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { clientProfile: true },
    });

    if (!user || !user.isActive) return unauthorized('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return unauthorized('Invalid credentials');

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const token = await createToken({
      userId:   user.id,
      email:    user.email,
      name:     user.name,
      role:     user.role,
      clientId: user.clientProfile?.clientId,
    });

    const res = ok({
      user:  { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      token,
    });

    // Set HTTP-only cookie
    const response = new Response(res.body, { status: 200, headers: res.headers });
    response.headers.set('Set-Cookie', `4ucs_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
