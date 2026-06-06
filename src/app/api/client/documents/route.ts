import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, created, badRequest, notFound, noContent, handleRouteError } from '@/lib/auth';
import { getDocuments, createDocument, deleteDocument } from '@/lib/services/client.service';
import { writeAuditLog } from '@/lib/services/analytics.service';
import { z } from 'zod';

const CreateDocumentSchema = z.object({
  name:      z.string().min(1).max(300),
  fileType:  z.enum(['pdf', 'doc', 'xls', 'ppt', 'zip']),
  fileSize:  z.number().int().min(1),
  fileUrl:   z.string().url(),
  clientId:  z.string().cuid().optional(),
  projectId: z.string().cuid().optional(),
  isPublic:  z.boolean().default(false),
});

// GET /api/client/documents
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'client:documents:read');
    const { searchParams } = new URL(req.url);
    const filters = {
      page:      Number(searchParams.get('page')  ?? 1),
      limit:     Number(searchParams.get('limit') ?? 20),
      search:    searchParams.get('search')        ?? undefined,
      sortBy:    'createdAt',
      sortDir:   'desc' as const,
      clientId:  searchParams.get('clientId')      ?? undefined,
      projectId: searchParams.get('projectId')     ?? undefined,
      fileType:  searchParams.get('fileType')      ?? undefined,
    };
    const result = await getDocuments(filters);
    return ok(result.data, { total: result.total, page: result.page, totalPages: result.totalPages });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/client/documents
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'client:documents:create');
    const body    = await req.json();
    const parsed  = CreateDocumentSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);

    const document = await createDocument(parsed.data, session.userId);
    await writeAuditLog({ userId: session.userId, action: 'CREATE', resource: 'Document', resourceId: document.id });
    return created(document);
  } catch (error) {
    return handleRouteError(error);
  }
}
