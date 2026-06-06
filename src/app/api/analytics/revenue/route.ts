import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, handleRouteError } from '@/lib/auth';
import { getRevenueAnalytics } from '@/lib/services/analytics.service';

// GET /api/analytics/revenue
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'analytics:read');
    const { searchParams } = new URL(req.url);
    const period = (searchParams.get('period') as 'month' | 'quarter' | 'year') ?? 'year';
    const data   = await getRevenueAnalytics(period);
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
