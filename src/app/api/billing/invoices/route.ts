import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, created, badRequest, handleRouteError } from '@/lib/auth';
import { getInvoices, createInvoice, getBillingSummary } from '@/lib/services/billing.service';
import { CreateInvoiceSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

// GET /api/billing/invoices
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'billing:invoices:read');
    const { searchParams } = new URL(req.url);

    if (searchParams.get('summary') === 'true') {
      const data = await getBillingSummary();
      return ok(data);
    }

    const filters = {
      page:     Number(searchParams.get('page')   ?? 1),
      limit:    Number(searchParams.get('limit')  ?? 20),
      search:   searchParams.get('search')         ?? undefined,
      sortBy:   searchParams.get('sortBy')         ?? 'createdAt',
      sortDir:  (searchParams.get('sortDir') as 'asc' | 'desc') ?? 'desc',
      clientId: searchParams.get('clientId')       ?? undefined,
      status:   searchParams.get('status')         ?? undefined,
    };

    const result = await getInvoices(filters);
    return ok(result.data, { total: result.total, page: result.page, totalPages: result.totalPages });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/billing/invoices
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'billing:invoices:create');
    const body    = await req.json();
    const parsed  = CreateInvoiceSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);

    const invoice = await createInvoice(parsed.data);
    await writeAuditLog({ userId: session.userId, action: 'CREATE', resource: 'Invoice', resourceId: invoice.id });
    return created(invoice);
  } catch (error) {
    return handleRouteError(error);
  }
}
