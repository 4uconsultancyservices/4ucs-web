import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, notFound, handleRouteError } from '@/lib/auth';
import { getFunnelData } from '@/lib/services/marketing.service';

// GET /api/marketing/funnels?campaignId=xxx
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'marketing:campaigns:read');
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');
    if (!campaignId) return notFound('campaignId query param required');

    const data = await getFunnelData(campaignId);
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
