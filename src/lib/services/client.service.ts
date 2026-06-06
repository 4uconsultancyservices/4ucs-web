import prisma from '@/lib/prisma';
import type {
  CreateClientInput, UpdateClientInput,
  CreateProjectInput, UpdateProjectInput,
  CreateTicketInput, UpdateTicketInput, CreateTicketCommentInput,
  PaginationInput,
} from '@/lib/validations';

// ── Client Services ───────────────────────────────────────

export async function getClients(filters: PaginationInput & { status?: string; plan?: string }) {
  const { page = 1, limit = 20, search, sortBy = 'createdAt', sortDir = 'desc', status, plan } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { industry: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(status && { status: status as any }),
    ...(plan   && { plan:   plan   as any }),
  };

  const [data, total] = await Promise.all([
    prisma.client.findMany({
      where, skip, take: limit,
      orderBy: { [sortBy]: sortDir },
      include: {
        _count: { select: { projects: true, tickets: true, invoices: true } },
        subscriptions: { where: { status: { in: ['ACTIVE', 'TRIAL'] } }, take: 1 },
      },
    }),
    prisma.client.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getClientById(id: string) {
  return prisma.client.findUnique({
    where: { id },
    include: {
      projects:      { orderBy: { createdAt: 'desc' }, take: 5 },
      tickets:       { orderBy: { createdAt: 'desc' }, take: 5 },
      invoices:      { orderBy: { createdAt: 'desc' }, take: 5 },
      subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 },
      documents:     { orderBy: { createdAt: 'desc' }, take: 5 },
      users:         { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
      _count: { select: { projects: true, tickets: true, invoices: true } },
    },
  });
}

export async function createClient(data: CreateClientInput) {
  const mrrMap = { GROWTH: 2500, ENTERPRISE: 8500, GLOBAL: 18000 };
  return prisma.client.create({
    data: { ...data, mrr: mrrMap[data.plan ?? 'GROWTH'] },
  });
}

export async function updateClient(id: string, data: UpdateClientInput) {
  return prisma.client.update({ where: { id }, data });
}

export async function deleteClient(id: string) {
  return prisma.client.delete({ where: { id } });
}

// ── Project Services ──────────────────────────────────────

export async function getProjects(filters: PaginationInput & { clientId?: string; status?: string }) {
  const { page = 1, limit = 20, search, sortBy = 'createdAt', sortDir = 'desc', clientId, status } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(search   && { name: { contains: search, mode: 'insensitive' as const } }),
    ...(clientId && { clientId }),
    ...(status   && { status: status as any }),
  };

  const [data, total] = await Promise.all([
    prisma.project.findMany({
      where, skip, take: limit,
      orderBy: { [sortBy]: sortDir },
      include: {
        client:     { select: { id: true, name: true } },
        milestones: { orderBy: { dueDate: 'asc' }, take: 3 },
        _count:     { select: { tasks: true, documents: true } },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      client:     { select: { id: true, name: true, industry: true } },
      tasks:      { orderBy: { order: 'asc' } },
      milestones: { orderBy: { dueDate: 'asc' } },
      documents:  { orderBy: { createdAt: 'desc' } },
    },
  });
}

export async function createProject(data: CreateProjectInput) {
  return prisma.project.create({
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      dueDate:   data.dueDate   ? new Date(data.dueDate)   : undefined,
    },
    include: { client: { select: { id: true, name: true } } },
  });
}

export async function updateProject(id: string, data: UpdateProjectInput) {
  const updateData: any = { ...data };
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.dueDate)   updateData.dueDate   = new Date(data.dueDate);
  if (data.status === 'COMPLETE') updateData.completedAt = new Date();

  return prisma.project.update({
    where: { id },
    data: updateData,
    include: { client: { select: { id: true, name: true } } },
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

// ── Ticket Services ───────────────────────────────────────

let ticketCounter = 2050;
async function generateTicketNumber(): Promise<string> {
  const last = await prisma.ticket.findFirst({ orderBy: { createdAt: 'desc' }, select: { ticketNumber: true } });
  if (last) {
    const num = parseInt(last.ticketNumber.replace('TKT-', ''), 10);
    ticketCounter = Math.max(ticketCounter, num);
  }
  return `TKT-${++ticketCounter}`;
}

export async function getTickets(filters: PaginationInput & { clientId?: string; status?: string; priority?: string; assignedToId?: string }) {
  const { page = 1, limit = 20, search, sortBy = 'createdAt', sortDir = 'desc', clientId, status, priority, assignedToId } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(search   && {
      OR: [
        { title:        { contains: search, mode: 'insensitive' as const } },
        { ticketNumber: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(clientId    && { clientId }),
    ...(status      && { status:      status   as any }),
    ...(priority    && { priority:    priority as any }),
    ...(assignedToId && { assignedToId }),
  };

  const [data, total] = await Promise.all([
    prisma.ticket.findMany({
      where, skip, take: limit,
      orderBy: { [sortBy]: sortDir },
      include: {
        client:     { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, avatar: true } },
        createdBy:  { select: { id: true, name: true } },
        _count:     { select: { comments: true } },
      },
    }),
    prisma.ticket.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getTicketById(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      client:     { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true, avatar: true } },
      createdBy:  { select: { id: true, name: true } },
      comments:   {
        orderBy: { createdAt: 'asc' },
        include: { user: { select: { id: true, name: true, avatar: true, role: true } } },
      },
      activities: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });
}

export async function createTicket(data: CreateTicketInput, createdById: string) {
  const ticketNumber = await generateTicketNumber();
  return prisma.ticket.create({
    data: { ...data, ticketNumber, createdById },
    include: {
      client:    { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });
}

export async function updateTicket(id: string, data: UpdateTicketInput) {
  const updateData: any = { ...data };
  if (data.status === 'RESOLVED') updateData.resolvedAt = new Date();
  if (data.status === 'CLOSED')   updateData.closedAt   = new Date();

  return prisma.ticket.update({
    where: { id },
    data: updateData,
    include: {
      client:     { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } },
    },
  });
}

export async function deleteTicket(id: string) {
  return prisma.ticket.delete({ where: { id } });
}

export async function addTicketComment(ticketId: string, data: CreateTicketCommentInput, userId: string) {
  const comment = await prisma.ticketComment.create({
    data: { ...data, ticketId, userId },
    include: { user: { select: { id: true, name: true, avatar: true, role: true } } },
  });
  await prisma.ticket.update({ where: { id: ticketId }, data: { updatedAt: new Date() } });
  return comment;
}

// ── Document Services ─────────────────────────────────────

export async function getDocuments(filters: PaginationInput & { clientId?: string; projectId?: string; fileType?: string }) {
  const { page = 1, limit = 20, search, clientId, projectId, fileType } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(search    && { name: { contains: search, mode: 'insensitive' as const } }),
    ...(clientId  && { clientId }),
    ...(projectId && { projectId }),
    ...(fileType  && { fileType }),
  };

  const [data, total] = await Promise.all([
    prisma.document.findMany({
      where, skip, take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        client:     { select: { id: true, name: true } },
        project:    { select: { id: true, name: true } },
        uploadedBy: { select: { id: true, name: true } },
      },
    }),
    prisma.document.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createDocument(data: {
  name: string; fileType: string; fileSize: number;
  fileUrl: string; clientId?: string; projectId?: string; isPublic?: boolean;
}, uploadedById: string) {
  return prisma.document.create({
    data: { ...data, uploadedById },
    include: {
      uploadedBy: { select: { id: true, name: true } },
      client:     { select: { id: true, name: true } },
    },
  });
}

export async function deleteDocument(id: string) {
  return prisma.document.delete({ where: { id } });
}
