import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, handleRouteError } from '@/lib/auth';
import { getSalesPerformance } from '@/lib/services/sales.service';

// GET /api/sales/performance
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'sales:deals:read');
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get('start')
      ? new Date(searchParams.get('start')!)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDate = searchParams.get('end')
      ? new Date(searchParams.get('end')!)
      : new Date();

    const data = await getSalesPerformance(startDate, endDate);
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
