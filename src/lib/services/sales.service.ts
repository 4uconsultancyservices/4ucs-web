import prisma from '@/lib/prisma';
import type { CreateDealInput, UpdateDealInput, UpdateDealStageInput, PaginationInput } from '@/lib/validations';
import type { DealStage } from '@prisma/client';

// ── Deal Services ─────────────────────────────────────────

export async function getDeals(filters: PaginationInput & { stage?: string; assignedToId?: string; clientId?: string }) {
  const { page = 1, limit = 20, search, sortBy = 'createdAt', sortDir = 'desc', stage, assignedToId, clientId } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(stage && { stage: stage as DealStage }),
    ...(assignedToId && { assignedToId }),
    ...(clientId && { clientId }),
  };

  const [data, total] = await Promise.all([
    prisma.deal.findMany({
      where, skip, take: limit,
      orderBy: { [sortBy]: sortDir },
      include: {
        assignedTo: { select: { id: true, name: true, avatar: true } },
        client:     { select: { id: true, name: true } },
        products:   true,
        _count:     { select: { activities: true } },
      },
    }),
    prisma.deal.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getDealById(id: string) {
  return prisma.deal.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
      client:     { select: { id: true, name: true, industry: true } },
      products:   true,
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 15,
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });
}

export async function createDeal(data: CreateDealInput) {
  return prisma.deal.create({
    data: {
      ...data,
      expectedClose: data.expectedClose ? new Date(data.expectedClose) : undefined,
    },
    include: {
      assignedTo: { select: { id: true, name: true } },
      client:     { select: { id: true, name: true } },
    },
  });
}

export async function updateDeal(id: string, data: UpdateDealInput) {
  return prisma.deal.update({
    where: { id },
    data: {
      ...data,
      expectedClose: data.expectedClose ? new Date(data.expectedClose) : undefined,
    },
    include: {
      assignedTo: { select: { id: true, name: true } },
      client:     { select: { id: true, name: true } },
    },
  });
}

export async function updateDealStage(id: string, data: UpdateDealStageInput) {
  const closedAt = (data.stage === 'WON' || data.stage === 'LOST') ? new Date() : undefined;
  return prisma.deal.update({
    where: { id },
    data: { ...data, ...(closedAt && { closedAt }) },
  });
}

export async function deleteDeal(id: string) {
  return prisma.deal.delete({ where: { id } });
}

// ── Pipeline Board ────────────────────────────────────────

export async function getPipelineBoard() {
  const stages: DealStage[] = ['PROSPECT', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];

  const deals = await prisma.deal.findMany({
    where: { stage: { in: stages } },
    include: {
      assignedTo: { select: { id: true, name: true, avatar: true } },
      client:     { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const board = stages.map(stage => ({
    stage,
    deals: deals.filter(d => d.stage === stage),
    totalValue: deals.filter(d => d.stage === stage).reduce((s, d) => s + d.value, 0),
    count: deals.filter(d => d.stage === stage).length,
  }));

  return board;
}

// ── Sales Performance ─────────────────────────────────────

export async function getSalesPerformance(startDate: Date, endDate: Date) {
  const [dealsByStage, wonDeals, lostDeals, totalPipeline, byRep] = await Promise.all([
    prisma.deal.groupBy({
      by: ['stage'],
      _count: { _all: true },
      _sum:   { value: true },
    }),
    prisma.deal.findMany({
      where: { stage: 'WON', closedAt: { gte: startDate, lte: endDate } },
      select: { value: true, assignedToId: true },
    }),
    prisma.deal.findMany({
      where: { stage: 'LOST', closedAt: { gte: startDate, lte: endDate } },
      select: { value: true, lostReason: true },
    }),
    prisma.deal.aggregate({
      where: { stage: { not: 'LOST' } },
      _sum: { value: true },
    }),
    prisma.deal.groupBy({
      by: ['assignedToId'],
      _count: { _all: true },
      _sum:   { value: true },
    }),
  ]);

  const wonRevenue  = wonDeals.reduce((s, d) => s + d.value, 0);
  const totalClosed = wonDeals.length + lostDeals.length;
  const winRate     = totalClosed > 0 ? Math.round((wonDeals.length / totalClosed) * 100) : 0;

  return {
    dealsByStage,
    wonDeals:      wonDeals.length,
    wonRevenue,
    lostDeals:     lostDeals.length,
    winRate,
    totalPipeline: totalPipeline._sum.value ?? 0,
    byRep,
  };
}
