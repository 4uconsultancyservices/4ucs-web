import { NextRequest } from 'next/server';
import { requireAuthAndPermission, ok, badRequest, notFound, noContent, handleRouteError } from '@/lib/auth';
import { getProjectById, updateProject, deleteProject } from '@/lib/services/client.service';
import { UpdateProjectSchema } from '@/lib/validations';
import { writeAuditLog } from '@/lib/services/analytics.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await requireAuthAndPermission(req, 'client:projects:read');
    const { id }  = await params;
    const project = await getProjectById(id);
    if (!project) return notFound('Project');
    return ok(project);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuthAndPermission(req, 'client:projects:update');
    const { id }  = await params;
    const body    = await req.json();
    const parsed  = UpdateProjectSchema.safeParse(body);
    if (!parsed.success) return badRequest('Validation failed', parsed.error.flatten().fieldErrors as Record<string, string[]>);

    const existing = await getProjectById(id);
    if (!existing) return notFound('Project');

    const project = await updateProject(id, parsed.data);
    await writeAuditLog({ userId: session.userId, action: 'UPDATE', resource: 'Project', resourceId: id });
    return ok(project);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAuthAndPermission(req, 'client:projects:delete');
    const { id }  = await params;
    const existing = await getProjectById(id);
    if (!existing) return notFound('Project');
    await deleteProject(id);
    await writeAuditLog({ userId: session.userId, action: 'DELETE', resource: 'Project', resourceId: id });
    return noContent();
  } catch (error) {
    return handleRouteError(error);
  }
}
