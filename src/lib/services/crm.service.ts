import prisma from '@/lib/prisma';
import type { CreateLeadInput, UpdateLeadInput, LeadFilterInput, CreateActivityInput } from '@/lib/validations';
import type { LeadStatus } from '@prisma/client';

// ── Lead Services ─────────────────────────────────────────

export async function getLeads(filters: LeadFilterInput) {
  const { page, limit, search, sortBy = 'createdAt', sortDir = 'desc', status, source, assignedToId, minScore, maxScore } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName:  { contains: search, mode: 'insensitive' as const } },
        { email:     { contains: search, mode: 'insensitive' as const } },
        { company:   { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(status      && { status: status as LeadStatus }),
    ...(source      && { source }),
    ...(assignedToId && { assignedToId }),
    ...(minScore !== undefined && { score: { gte: minScore } }),
    ...(maxScore !== undefined && { score: { lte: maxScore } }),
  };

  const [data, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortDir },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy:  { select: { id: true, name: true } },
        tags:       true,
        _count:     { select: { activities: true } },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
      createdBy:  { select: { id: true, name: true } },
      tags:       true,
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { id: true, name: true, avatar: true } } },
      },
    },
  });
}

export async function createLead(data: CreateLeadInput, createdById: string) {
  const { ...rest } = data;
  return prisma.lead.create({
    data: { ...rest, createdById },
    include: {
      assignedTo: { select: { id: true, name: true } },
      tags:       true,
    },
  });
}

export async function updateLead(id: string, data: UpdateLeadInput) {
  return prisma.lead.update({
    where: { id },
    data,
    include: {
      assignedTo: { select: { id: true, name: true } },
      tags:       true,
    },
  });
}

export async function deleteLead(id: string) {
  return prisma.lead.delete({ where: { id } });
}

export async function getLeadStats() {
  const [byStatus, bySource, avgScore, total] = await Promise.all([
    prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
    prisma.lead.aggregate({ _avg: { score: true } }),
    prisma.lead.count(),
  ]);

  const wonLeads   = byStatus.find(s => s.status === 'WON')?._count._all ?? 0;
  const totalClosed = (byStatus.find(s => s.status === 'WON')?._count._all ?? 0) +
                      (byStatus.find(s => s.status === 'LOST')?._count._all ?? 0);
  const conversionRate = totalClosed > 0 ? Math.round((wonLeads / totalClosed) * 100) : 0;

  return { byStatus, bySource, avgScore: avgScore._avg.score ?? 0, total, conversionRate };
}

// ── Activity Services ─────────────────────────────────────

export async function getActivities(filters: {
  userId?: string; leadId?: string; dealId?: string;
  clientId?: string; page?: number; limit?: number;
}) {
  const { userId, leadId, dealId, clientId, page = 1, limit = 20 } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(userId   && { userId }),
    ...(leadId   && { leadId }),
    ...(dealId   && { dealId }),
    ...(clientId && { clientId }),
  };

  const [data, total] = await Promise.all([
    prisma.activity.findMany({
      where, skip, take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user:   { select: { id: true, name: true, avatar: true } },
        lead:   { select: { id: true, firstName: true, lastName: true, company: true } },
        deal:   { select: { id: true, title: true } },
        client: { select: { id: true, name: true } },
      },
    }),
    prisma.activity.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createActivity(data: CreateActivityInput, userId: string) {
  return prisma.activity.create({
    data: {
      ...data,
      userId,
      dueAt: data.dueAt ? new Date(data.dueAt) : undefined,
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      lead: { select: { id: true, firstName: true, lastName: true } },
    },
  });
}

export async function completeActivity(id: string) {
  return prisma.activity.update({
    where: { id },
    data: { completedAt: new Date() },
  });
}

export async function deleteActivity(id: string) {
  return prisma.activity.delete({ where: { id } });
}
