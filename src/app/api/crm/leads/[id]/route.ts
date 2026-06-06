import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, badRequest, notFound, noContent, handleRouteError } from '@/lib/auth';
import { getLeadById, updateLead, deleteLead } from '@/lib/services/crm.service';
import { UpdateLeadSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

type Params = { params: Promise<{ id: string }> };

// GET /api/crm/leads/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuthAndPermission(req, 'crm:leads:read');
    const { id } = await params;
    const lead   = await getLeadById(id);
    if (!lead) return notFound('Lead');
    return ok(lead);
  } catch (error) {
    return handleRouteError(error);
  }
}

// PATCH /api/crm/leads/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuthAndPermission(req, 'crm:leads:update');
    const { id }  = await params;
    const body    = await req.json();
    const parsed  = UpdateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const existing = await getLeadById(id);
    if (!existing) return notFound('Lead');

    const lead = await updateLead(id, parsed.data);
    await writeAuditLog({ userId: session.userId, action: 'UPDATE', resource: 'Lead', resourceId: id, metadata: parsed.data as Record<string, unknown> });
    return ok(lead);
  } catch (error) {
    return handleRouteError(error);
  }
}

// DELETE /api/crm/leads/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuthAndPermission(req, 'crm:leads:delete');
    const { id }  = await params;
    const existing = await getLeadById(id);
    if (!existing) return notFound('Lead');

    await deleteLead(id);
    await writeAuditLog({ userId: session.userId, action: 'DELETE', resource: 'Lead', resourceId: id });
    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
