import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, badRequest, notFound, noContent, handleRouteError } from '@/lib/auth';
import { getClientById, updateClient, deleteClient } from '@/lib/services/client.service';
import { UpdateClientSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuthAndPermission(req, 'client:clients:read');
    const { id } = await params;
    const client = await getClientById(id);
    if (!client) return notFound('Client');
    return ok(client);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuthAndPermission(req, 'client:clients:update');
    const { id }  = await params;
    const body    = await req.json();
    const parsed  = UpdateClientSchema.safeParse(body);

    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
    const existing = await getClientById(id);
    if (!existing) return notFound('Client');

    const client = await updateClient(id, parsed.data);
    await writeAuditLog({ userId: session.userId, action: 'UPDATE', resource: 'Client', resourceId: id });
    return ok(client);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuthAndPermission(req, 'client:clients:delete');
    const { id }  = await params;
    const existing = await getClientById(id);
    if (!existing) return notFound('Client');
    await deleteClient(id);
    await writeAuditLog({ userId: session.userId, action: 'DELETE', resource: 'Client', resourceId: id });
    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
