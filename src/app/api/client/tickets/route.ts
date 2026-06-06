import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, created, badRequest, notFound, noContent, handleRouteError } from '@/lib/auth';
import { getTickets, createTicket, getTicketById, updateTicket, deleteTicket, addTicketComment } from '@/lib/services/client.service';
import { CreateTicketSchema, UpdateTicketSchema, CreateTicketCommentSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

// GET /api/client/tickets
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'client:tickets:read');
    const { searchParams } = new URL(req.url);
    const filters = {
      page:         Number(searchParams.get('page')  ?? 1),
      limit:        Number(searchParams.get('limit') ?? 20),
      search:       searchParams.get('search')        ?? undefined,
      sortBy:       searchParams.get('sortBy')        ?? 'createdAt',
      sortDir:      (searchParams.get('sortDir') as 'asc' | 'desc') ?? 'desc',
      clientId:     searchParams.get('clientId')      ?? undefined,
      status:       searchParams.get('status')        ?? undefined,
      priority:     searchParams.get('priority')      ?? undefined,
      assignedToId: searchParams.get('assignedToId')  ?? undefined,
    };
    const result = await getTickets(filters);
    return ok(result.data, { total: result.total, page: result.page, totalPages: result.totalPages });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/client/tickets
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'client:tickets:create');
    const body    = await req.json();
    const parsed  = CreateTicketSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);

    const ticket = await createTicket(parsed.data, session.userId);
    await writeAuditLog({ userId: session.userId, action: 'CREATE', resource: 'Ticket', resourceId: ticket.id });
    return created(ticket);
  } catch (error) {
    return handleRouteError(error);
  }
}
