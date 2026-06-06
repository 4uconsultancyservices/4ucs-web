import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, handleRouteError } from '@/lib/auth';
import { getSalesAnalytics } from '@/lib/services/analytics.service';

export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'analytics:read');
    const data = await getSalesAnalytics();
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
