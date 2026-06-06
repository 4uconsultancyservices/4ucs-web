import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, handleRouteError } from '@/lib/auth';
import { getPayments } from '@/lib/services/billing.service';

// GET /api/billing/payments
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'billing:invoices:read');
    const { searchParams } = new URL(req.url);
    const filters = {
      page:      Number(searchParams.get('page')  ?? 1),
      limit:     Number(searchParams.get('limit') ?? 20),
      sortBy:    'createdAt',
      sortDir:   'desc' as const,
      invoiceId: searchParams.get('invoiceId') ?? undefined,
    };
    const result = await getPayments(filters);
    return ok(result.data, { total: result.total, page: result.page, totalPages: result.totalPages });
  } catch (error) {
    return handleRouteError(error);
  }
}
