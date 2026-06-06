import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, badRequest, notFound, noContent, handleRouteError } from '@/lib/auth';
import { getInvoiceById, updateInvoice, deleteInvoice, markInvoicePaid } from '@/lib/services/billing.service';
import { UpdateInvoiceSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuthAndPermission(req, 'billing:invoices:read');
    const { id }   = await params;
    const invoice  = await getInvoiceById(id);
    if (!invoice) return notFound('Invoice');
    return ok(invoice);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session  = await requireAuthAndPermission(req, 'billing:invoices:update');
    const { id }   = await params;
    const body     = await req.json();

    // Quick mark-paid action
    if (body.action === 'mark_paid') {
      const result = await markInvoicePaid(id, body.method);
      await writeAuditLog({ userId: session.userId, action: 'UPDATE', resource: 'Invoice', resourceId: id, metadata: { action: 'mark_paid' } });
      return ok(result);
    }

    const parsed = UpdateInvoiceSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);

    const existing = await getInvoiceById(id);
    if (!existing) return notFound('Invoice');

    const invoice = await updateInvoice(id, parsed.data);
    await writeAuditLog({ userId: session.userId, action: 'UPDATE', resource: 'Invoice', resourceId: id });
    return ok(invoice);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session  = await requireAuthAndPermission(req, 'billing:invoices:delete');
    const { id }   = await params;
    const existing = await getInvoiceById(id);
    if (!existing) return notFound('Invoice');
    if (existing.status === 'PAID') return badRequest('Cannot delete a paid invoice');
    await deleteInvoice(id);
    await writeAuditLog({ userId: session.userId, action: 'DELETE', resource: 'Invoice', resourceId: id });
    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
