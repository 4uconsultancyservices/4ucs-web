import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, badRequest, notFound, noContent, handleRouteError } from '@/lib/auth';
import { getCampaignById, updateCampaign, deleteCampaign, getCampaignStats } from '@/lib/services/marketing.service';
import { UpdateCampaignSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

type Params = { params: Promise<{ id: string }> };

// GET /api/marketing/campaigns/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuthAndPermission(req, 'marketing:campaigns:read');
    const { id } = await params;
    const { searchParams } = new URL(req.url);

    if (searchParams.get('stats') === 'true') {
      const stats = await getCampaignStats(id);
      if (!stats) return notFound('Campaign');
      return ok(stats);
    }

    const campaign = await getCampaignById(id);
    if (!campaign) return notFound('Campaign');
    return ok(campaign);
  } catch (error) {
    return handleRouteError(error);
  }
}

// PATCH /api/marketing/campaigns/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuthAndPermission(req, 'marketing:campaigns:update');
    const { id }  = await params;
    const body    = await req.json();
    const parsed  = UpdateCampaignSchema.safeParse(body);

    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);

    const existing = await getCampaignById(id);
    if (!existing) return notFound('Campaign');

    const campaign = await updateCampaign(id, parsed.data);
    await writeAuditLog({ userId: session.userId, action: 'UPDATE', resource: 'Campaign', resourceId: id });
    return ok(campaign);
  } catch (error) {
    return handleRouteError(error);
  }
}

// DELETE /api/marketing/campaigns/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuthAndPermission(req, 'marketing:campaigns:delete');
    const { id }  = await params;
    const existing = await getCampaignById(id);
    if (!existing) return notFound('Campaign');
    await deleteCampaign(id);
    await writeAuditLog({ userId: session.userId, action: 'DELETE', resource: 'Campaign', resourceId: id });
    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
