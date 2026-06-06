import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, badRequest, notFound, noContent, handleRouteError } from '@/lib/auth';
import { getDealById, updateDeal, updateDealStage, deleteDeal } from '@/lib/services/sales.service';
import { UpdateDealSchema, UpdateDealStageSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

type Params = { params: Promise<{ id: string }> };

// GET /api/sales/deals/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuthAndPermission(req, 'sales:deals:read');
    const { id } = await params;
    const deal   = await getDealById(id);
    if (!deal) return notFound('Deal');
    return ok(deal);
  } catch (error) {
    return handleRouteError(error);
  }
}

// PATCH /api/sales/deals/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuthAndPermission(req, 'sales:deals:update');
    const { id }  = await params;
    const body    = await req.json();

    // Support both full update and stage-only update
    if (body.stageOnly) {
      const parsed = UpdateDealStageSchema.safeParse(body);
      if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);
      const deal = await updateDealStage(id, parsed.data);
      await writeAuditLog({ userId: session.userId, action: 'UPDATE', resource: 'Deal', resourceId: id, metadata: { stage: parsed.data.stage } });
      return ok(deal);
    }

    const parsed = UpdateDealSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);

    const existing = await getDealById(id);
    if (!existing) return notFound('Deal');

    const deal = await updateDeal(id, parsed.data);
    await writeAuditLog({ userId: session.userId, action: 'UPDATE', resource: 'Deal', resourceId: id });
    return ok(deal);
  } catch (error) {
    return handleRouteError(error);
  }
}

// DELETE /api/sales/deals/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuthAndPermission(req, 'sales:deals:delete');
    const { id }  = await params;
    const existing = await getDealById(id);
    if (!existing) return notFound('Deal');
    await deleteDeal(id);
    await writeAuditLog({ userId: session.userId, action: 'DELETE', resource: 'Deal', resourceId: id });
    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
