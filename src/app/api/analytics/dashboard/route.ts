import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, handleRouteError } from '@/lib/auth';
import { getDashboardSummary } from '@/lib/services/analytics.service';

// GET /api/analytics/dashboard
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'analytics:read');
    const data = await getDashboardSummary();
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
