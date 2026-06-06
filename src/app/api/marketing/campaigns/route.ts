import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, created, badRequest, handleRouteError } from '@/lib/auth';
import { getCampaigns, createCampaign, getMarketingAnalytics } from '@/lib/services/marketing.service';
import { PaginationSchema, CreateCampaignSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

// GET /api/marketing/campaigns
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'marketing:campaigns:read');
    const { searchParams } = new URL(req.url);

    if (searchParams.get('analytics') === 'true') {
      const data = await getMarketingAnalytics();
      return ok(data);
    }

    const filters = {
      page:    Number(searchParams.get('page')   ?? 1),
      limit:   Number(searchParams.get('limit')  ?? 20),
      search:  searchParams.get('search')         ?? undefined,
      sortBy:  searchParams.get('sortBy')         ?? 'createdAt',
      sortDir: (searchParams.get('sortDir') as 'asc' | 'desc') ?? 'desc',
      status:  searchParams.get('status')         ?? undefined,
      type:    searchParams.get('type')           ?? undefined,
    };

    const result = await getCampaigns(filters);
    return ok(result.data, { total: result.total, page: result.page, totalPages: result.totalPages });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/marketing/campaigns
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'marketing:campaigns:create');
    const body    = await req.json();
    const parsed  = CreateCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const campaign = await createCampaign(parsed.data, session.userId);
    await writeAuditLog({ userId: session.userId, action: 'CREATE', resource: 'Campaign', resourceId: campaign.id });
    return created(campaign);
  } catch (error) {
    return handleRouteError(error);
  }
}
