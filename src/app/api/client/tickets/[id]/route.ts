import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, created, badRequest, notFound, noContent, handleRouteError } from '@/lib/auth';
import { getTicketById, updateTicket, deleteTicket, addTicketComment } from '@/lib/services/client.service';
import { UpdateTicketSchema, CreateTicketCommentSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuthAndPermission(req, 'client:tickets:read');
    const { id }   = await params;
    const ticket   = await getTicketById(id);
    if (!ticket) return notFound('Ticket');
    return ok(ticket);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuthAndPermission(req, 'client:tickets:update');
    const { id }  = await params;
    const body    = await req.json();

    // Add comment sub-action
    if (body.action === 'comment') {
      const parsed = CreateTicketCommentSchema.safeParse(body);
      if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
      const comment = await addTicketComment(id, parsed.data, session.userId);
      return created(comment);
    }

    const parsed = UpdateTicketSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);

    const existing = await getTicketById(id);
    if (!existing) return notFound('Ticket');

    const ticket = await updateTicket(id, parsed.data);
    await writeAuditLog({ userId: session.userId, action: 'UPDATE', resource: 'Ticket', resourceId: id, metadata: parsed.data as Record<string, unknown> });
    return ok(ticket);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session  = await requireAuthAndPermission(req, 'client:tickets:delete');
    const { id }   = await params;
    const existing = await getTicketById(id);
    if (!existing) return notFound('Ticket');
    await deleteTicket(id);
    await writeAuditLog({ userId: session.userId, action: 'DELETE', resource: 'Ticket', resourceId: id });
    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
