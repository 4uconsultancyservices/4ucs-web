import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, created, badRequest, noContent, notFound, handleRouteError } from '@/lib/auth';
import { getSegments, createSegment, updateSegment, deleteSegment } from '@/lib/services/marketing.service';
import { CreateSegmentSchema, PaginationSchema } from '@/lib/validations';

// GET /api/marketing/segments
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'marketing:campaigns:read');
    const { searchParams } = new URL(req.url);
    const filters = PaginationSchema.parse(Object.fromEntries(searchParams));
    const result  = await getSegments(filters);
    return ok(result.data, { total: result.total, page: result.page, totalPages: result.totalPages });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/marketing/segments
export async function POST(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'marketing:campaigns:create');
    const body   = await req.json();
    const parsed = CreateSegmentSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);

    const segment = await createSegment(parsed.data);
    return created(segment);
  } catch (error) {
    return handleRouteError(error);
  }
}
