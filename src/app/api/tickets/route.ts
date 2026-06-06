import { NextRequest, NextResponse } from 'next/server';
import { tickets } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');

  let result = [...tickets];
  if (status && status !== 'all') result = result.filter(t => t.status === status);
  if (priority && priority !== 'all') result = result.filter(t => t.priority === priority);

  return NextResponse.json({ data: result, total: result.length });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, clientId, clientName, priority } = body;
    if (!title || !clientId) {
      return NextResponse.json({ error: 'title and clientId are required' }, { status: 400 });
    }
    const newTicket = {
      id: `TKT-${Math.floor(2042 + Math.random() * 1000)}`,
      title, description: description ?? '',
      clientId, clientName: clientName ?? '',
      priority: priority ?? 'medium', status: 'open' as const,
      assignee: 'Unassigned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    };
    return NextResponse.json({ data: newTicket }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
