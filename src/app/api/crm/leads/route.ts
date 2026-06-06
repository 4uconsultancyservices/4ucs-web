import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, created, badRequest, handleRouteError } from '@/lib/auth';
import { getLeads, createLead, getLeadStats } from '@/lib/services/crm.service';
import { LeadFilterSchema, CreateLeadSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

// GET /api/crm/leads
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'crm:leads:read');
    const { searchParams } = new URL(req.url);

    if (searchParams.get('stats') === 'true') {
      const stats = await getLeadStats();
      return ok(stats);
    }

    const filters = LeadFilterSchema.parse(Object.fromEntries(searchParams));
    const result  = await getLeads(filters);
    return ok(result.data, { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/crm/leads
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'crm:leads:create');
    const body    = await req.json();
    const parsed  = CreateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const lead = await createLead(parsed.data, session.userId);
    await writeAuditLog({ userId: session.userId, action: 'CREATE', resource: 'Lead', resourceId: lead.id });
    return created(lead);
  } catch (error) {
    return handleRouteError(error);
  }
}
