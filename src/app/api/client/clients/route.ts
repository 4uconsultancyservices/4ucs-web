import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, created, badRequest, handleRouteError } from '@/lib/auth';
import { getClients, createClient } from '@/lib/services/client.service';
import { CreateClientSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

// GET /api/client/clients
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'client:clients:read');
    const { searchParams } = new URL(req.url);

    const filters = {
      page:    Number(searchParams.get('page')   ?? 1),
      limit:   Number(searchParams.get('limit')  ?? 20),
      search:  searchParams.get('search')         ?? undefined,
      sortBy:  searchParams.get('sortBy')         ?? 'createdAt',
      sortDir: (searchParams.get('sortDir') as 'asc' | 'desc') ?? 'desc',
      status:  searchParams.get('status')         ?? undefined,
      plan:    searchParams.get('plan')           ?? undefined,
    };

    const result = await getClients(filters);
    return ok(result.data, { total: result.total, page: result.page, totalPages: result.totalPages });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/client/clients
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'client:clients:create');
    const body    = await req.json();
    const parsed  = CreateClientSchema.safeParse(body);

    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);

    const client = await createClient(parsed.data);
    await writeAuditLog({ userId: session.userId, action: 'CREATE', resource: 'Client', resourceId: client.id });
    return created(client);
  } catch (error) {
    return handleRouteError(error);
  }
}
