import prisma from '@/lib/prisma';
import type { CreateCampaignInput, UpdateCampaignInput, CreateSegmentInput, PaginationInput } from '@/lib/validations';
import type { CampaignStatus } from '@prisma/client';

// ── Campaign Services ─────────────────────────────────────

export async function getCampaigns(filters: PaginationInput & { status?: string; type?: string }) {
  const { page = 1, limit = 20, search, sortBy = 'createdAt', sortDir = 'desc', status, type } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    ...(status && { status: status as CampaignStatus }),
    ...(type   && { type:   type   as any }),
  };

  const [data, total] = await Promise.all([
    prisma.campaign.findMany({
      where, skip, take: limit,
      orderBy: { [sortBy]: sortDir },
      include: {
        createdBy: { select: { id: true, name: true } },
        segment:   { select: { id: true, name: true, count: true } },
        _count:    { select: { recipients: true } },
      },
    }),
    prisma.campaign.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getCampaignById(id: string) {
  return prisma.campaign.findUnique({
    where: { id },
    include: {
      createdBy:   { select: { id: true, name: true } },
      segment:     true,
      funnelSteps: { orderBy: { order: 'asc' } },
      recipients:  { take: 100, orderBy: { sentAt: 'desc' } },
    },
  });
}

export async function createCampaign(data: CreateCampaignInput, createdById: string) {
  return prisma.campaign.create({
    data: {
      ...data,
      createdById,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    },
    include: {
      createdBy: { select: { id: true, name: true } },
    },
  });
}

export async function updateCampaign(id: string, data: UpdateCampaignInput) {
  return prisma.campaign.update({
    where: { id },
    data: {
      ...data,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    },
  });
}

export async function deleteCampaign(id: string) {
  return prisma.campaign.delete({ where: { id } });
}

export async function getCampaignStats(id: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    select: { impressions: true, clicks: true, conversions: true, opens: true, bounces: true, unsubscribes: true, budget: true, spent: true, _count: { select: { recipients: true } } },
  });
  if (!campaign) return null;

  const recipients = campaign._count.recipients;
  const openRate        = recipients > 0 ? ((campaign.opens / recipients) * 100).toFixed(1) : '0';
  const clickRate       = recipients > 0 ? ((campaign.clicks / recipients) * 100).toFixed(1) : '0';
  const conversionRate  = recipients > 0 ? ((campaign.conversions / recipients) * 100).toFixed(1) : '0';
  const roi             = campaign.spent > 0 ? (((campaign.conversions * 850) - campaign.spent) / campaign.spent * 100).toFixed(1) : '0';

  return { ...campaign, recipients, openRate, clickRate, conversionRate, roi };
}

// ── Segment Services ──────────────────────────────────────

export async function getSegments(filters: PaginationInput) {
  const { page = 1, limit = 20, search } = filters;
  const skip = (page - 1) * limit;

  const where = search
    ? { name: { contains: search, mode: 'insensitive' as const } }
    : {};

  const [data, total] = await Promise.all([
    prisma.segment.findMany({
      where, skip, take: limit,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { campaigns: true } } },
    }),
    prisma.segment.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createSegment(data: CreateSegmentInput) {
  return prisma.segment.create({ data });
}

export async function updateSegment(id: string, data: Partial<CreateSegmentInput>) {
  return prisma.segment.update({ where: { id }, data });
}

export async function deleteSegment(id: string) {
  return prisma.segment.delete({ where: { id } });
}

// ── Funnel Tracking ───────────────────────────────────────

export async function getFunnelData(campaignId: string) {
  const steps = await prisma.funnelStep.findMany({
    where: { campaignId },
    orderBy: { order: 'asc' },
  });

  return steps.map((step, i) => ({
    ...step,
    conversionRate: i > 0 && steps[i - 1].visitors > 0
      ? ((step.visitors / steps[i - 1].visitors) * 100).toFixed(1)
      : '100',
  }));
}

// ── Marketing Analytics ───────────────────────────────────

export async function getMarketingAnalytics() {
  const [campaignsByStatus, totalBudget, totalSpent, topCampaigns] = await Promise.all([
    prisma.campaign.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.campaign.aggregate({ _sum: { budget: true } }),
    prisma.campaign.aggregate({ _sum: { spent: true } }),
    prisma.campaign.findMany({
      orderBy: { conversions: 'desc' },
      take: 5,
      select: { id: true, name: true, type: true, conversions: true, clicks: true, opens: true, spent: true },
    }),
  ]);

  return {
    campaignsByStatus,
    totalBudget: totalBudget._sum.budget ?? 0,
    totalSpent:  totalSpent._sum.spent   ?? 0,
    topCampaigns,
  };
}
