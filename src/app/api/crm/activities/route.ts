import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, created, badRequest, handleRouteError } from '@/lib/auth';
import { getActivities, createActivity, completeActivity, deleteActivity } from '@/lib/services/crm.service';
import { CreateActivitySchema, PaginationSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

// GET /api/crm/activities
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'crm:leads:read');
    const { searchParams } = new URL(req.url);

    const filters = {
      userId:   searchParams.get('userId') ?? undefined,
      leadId:   searchParams.get('leadId') ?? undefined,
      dealId:   searchParams.get('dealId') ?? undefined,
      clientId: searchParams.get('clientId') ?? undefined,
      page:     Number(searchParams.get('page') ?? 1),
      limit:    Number(searchParams.get('limit') ?? 20),
    };

    const result = await getActivities(filters);
    return ok(result.data, { total: result.total, page: result.page, totalPages: result.totalPages });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/crm/activities
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'crm:leads:create');
    const body    = await req.json();
    const parsed  = CreateActivitySchema.safeParse(body);

    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const activity = await createActivity(parsed.data, session.userId);
    await writeAuditLog({ userId: session.userId, action: 'CREATE', resource: 'Activity', resourceId: activity.id });
    return created(activity);
  } catch (error) {
    return handleRouteError(error);
  }
}
