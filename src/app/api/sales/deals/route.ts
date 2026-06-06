import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, created, badRequest, handleRouteError } from '@/lib/auth';
import { getDeals, createDeal } from '@/lib/services/sales.service';
import { PaginationSchema, CreateDealSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

// GET /api/sales/deals
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'sales:deals:read');
    const { searchParams } = new URL(req.url);

    const filters = {
      page:         Number(searchParams.get('page')  ?? 1),
      limit:        Number(searchParams.get('limit') ?? 20),
      search:       searchParams.get('search')       ?? undefined,
      sortBy:       searchParams.get('sortBy')       ?? 'createdAt',
      sortDir:      (searchParams.get('sortDir') as 'asc' | 'desc') ?? 'desc',
      stage:        searchParams.get('stage')        ?? undefined,
      assignedToId: searchParams.get('assignedToId') ?? undefined,
      clientId:     searchParams.get('clientId')     ?? undefined,
    };

    const result = await getDeals(filters);
    return ok(result.data, { total: result.total, page: result.page, totalPages: result.totalPages });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/sales/deals
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'sales:deals:create');
    const body    = await req.json();
    const parsed  = CreateDealSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const deal = await createDeal(parsed.data);
    await writeAuditLog({ userId: session.userId, action: 'CREATE', resource: 'Deal', resourceId: deal.id });
    return created(deal);
  } catch (error) {
    return handleRouteError(error);
  }
}
