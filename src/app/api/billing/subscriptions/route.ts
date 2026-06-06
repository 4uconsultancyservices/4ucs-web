import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, created, badRequest, notFound, handleRouteError } from '@/lib/auth';
import { getSubscriptions, createSubscription, cancelSubscription } from '@/lib/services/billing.service';
import { CreateSubscriptionSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

// GET /api/billing/subscriptions
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'billing:subscriptions:read');
    const { searchParams } = new URL(req.url);
    const filters = {
      page:     Number(searchParams.get('page')  ?? 1),
      limit:    Number(searchParams.get('limit') ?? 20),
      sortBy:   'createdAt',
      sortDir:  'desc' as const,
      clientId: searchParams.get('clientId')      ?? undefined,
      status:   searchParams.get('status')        ?? undefined,
      plan:     searchParams.get('plan')          ?? undefined,
    };
    const result = await getSubscriptions(filters);
    return ok(result.data, { total: result.total, page: result.page, totalPages: result.totalPages });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/billing/subscriptions
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'billing:subscriptions:update');
    const body    = await req.json();

    // Support cancel action
    if (body.action === 'cancel' && body.id) {
      const sub = await cancelSubscription(body.id);
      await writeAuditLog({ userId: session.userId, action: 'UPDATE', resource: 'Subscription', resourceId: body.id, metadata: { action: 'cancel' } });
      return ok(sub);
    }

    const parsed = CreateSubscriptionSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);

    const subscription = await createSubscription(parsed.data);
    await writeAuditLog({ userId: session.userId, action: 'CREATE', resource: 'Subscription', resourceId: subscription.id });
    return created(subscription);
  } catch (error) {
    return handleRouteError(error);
  }
}
