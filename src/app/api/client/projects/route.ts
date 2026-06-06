import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, created, badRequest, notFound, noContent, handleRouteError } from '@/lib/auth';
import { getProjects, createProject, getProjectById, updateProject, deleteProject } from '@/lib/services/client.service';
import { CreateProjectSchema, UpdateProjectSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

// GET /api/client/projects
export async function GET(req: NextRequest) {
  try {
    await requireAuthAndPermission(req, 'client:projects:read');
    const { searchParams } = new URL(req.url);
    const filters = {
      page:     Number(searchParams.get('page')  ?? 1),
      limit:    Number(searchParams.get('limit') ?? 20),
      search:   searchParams.get('search')        ?? undefined,
      sortBy:   searchParams.get('sortBy')        ?? 'createdAt',
      sortDir:  (searchParams.get('sortDir') as 'asc' | 'desc') ?? 'desc',
      clientId: searchParams.get('clientId')      ?? undefined,
      status:   searchParams.get('status')        ?? undefined,
    };
    const result = await getProjects(filters);
    return ok(result.data, { total: result.total, page: result.page, totalPages: result.totalPages });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/client/projects
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthAndPermission(req, 'client:projects:create');
    const body    = await req.json();
    const parsed  = CreateProjectSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);

    const project = await createProject(parsed.data);
    await writeAuditLog({ userId: session.userId, action: 'CREATE', resource: 'Project', resourceId: project.id });
    return created(project);
  } catch (error) {
    return handleRouteError(error);
  }
}
