import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, handleRouteError } from '@/lib/auth';
import { getActivityAnalytics } from '@/lib/services/analytics.service';

export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'analytics:read');
    const data = await getActivityAnalytics();
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
