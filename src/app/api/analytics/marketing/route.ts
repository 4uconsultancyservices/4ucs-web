import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, handleRouteError } from '@/lib/auth';
import { getMarketingAnalytics } from '@/lib/services/marketing.service';

export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'analytics:read');
    const data = await getMarketingAnalytics();
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
