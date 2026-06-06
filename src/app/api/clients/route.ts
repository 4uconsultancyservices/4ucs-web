import { NextRequest, NextResponse } from 'next/server';
import { clients } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const plan = searchParams.get('plan');
  const q = searchParams.get('q')?.toLowerCase();

  let result = [...clients];
  if (status && status !== 'all') result = result.filter(c => c.status === status);
  if (plan && plan !== 'all') result = result.filter(c => c.plan === plan);
  if (q) result = result.filter(c => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));

  return NextResponse.json({
    data: result,
    total: result.length,
    meta: { page: 1, perPage: result.length },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, industry, plan, contact, email, country } = body;
    if (!name || !email) {
      return NextResponse.json({ error: 'name and email are required' }, { status: 400 });
    }
    // In production, persist to DB here
    const newClient = {
      id: `c${Date.now()}`,
      name, industry: industry ?? 'Unknown', plan: plan ?? 'Growth',
      mrr: plan === 'Global' ? 18000 : plan === 'Enterprise' ? 8500 : 2500,
      status: 'onboarding' as const,
      contact: contact ?? '', email, country: country ?? 'USA',
      joinedAt: new Date().toISOString().split('T')[0],
      avatar: name.slice(0, 2).toUpperCase(),
    };
    return NextResponse.json({ data: newClient }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
