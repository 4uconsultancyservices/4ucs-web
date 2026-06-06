import prisma from '@/lib/prisma';

// ── Revenue Analytics ─────────────────────────────────────

export async function getRevenueAnalytics(period: 'month' | 'quarter' | 'year' = 'year') {
  const now   = new Date();
  const start = period === 'month'
    ? new Date(now.getFullYear(), now.getMonth() - 11, 1)
    : period === 'quarter'
      ? new Date(now.getFullYear(), now.getMonth() - 2, 1)
      : new Date(now.getFullYear(), 0, 1);

  const [snapshots, currentMRR, subscriptionsByPlan, churnedThisPeriod] = await Promise.all([
    prisma.analyticsSnapshot.findMany({
      where: { metric: 'mrr', date: { gte: start } },
      orderBy: { date: 'asc' },
    }),
    prisma.subscription.aggregate({
      where:  { status: 'ACTIVE' },
      _sum:   { mrr: true },
      _count: { _all: true },
    }),
    prisma.subscription.groupBy({
      by:     ['plan', 'status'],
      _count: { _all: true },
      _sum:   { mrr: true },
      where:  { status: { in: ['ACTIVE', 'TRIAL'] } },
    }),
    prisma.subscription.count({
      where: { status: 'CANCELLED', cancelledAt: { gte: start } },
    }),
  ]);

  const mrr = currentMRR._sum.mrr ?? 0;
  const arr = mrr * 12;

  return {
    mrr, arr,
    activeSubscriptions: currentMRR._count._all,
    snapshots,
    subscriptionsByPlan,
    churnedThisPeriod,
    churnRate: currentMRR._count._all > 0
      ? ((churnedThisPeriod / currentMRR._count._all) * 100).toFixed(2)
      : '0',
  };
}

// ── Sales Analytics ───────────────────────────────────────

export async function getSalesAnalytics() {
  const now           = new Date();
  const monthStart    = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    dealsByStage, wonThisMonth, wonLastMonth,
    leadsThisMonth, leadsLastMonth, pipelineValue,
    topPerformers, leadsBySource,
  ] = await Promise.all([
    prisma.deal.groupBy({ by: ['stage'], _count: { _all: true }, _sum: { value: true } }),
    prisma.deal.findMany({
      where:  { stage: 'WON', closedAt: { gte: monthStart } },
      select: { value: true },
    }),
    prisma.deal.findMany({
      where:  { stage: 'WON', closedAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      select: { value: true },
    }),
    prisma.lead.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.lead.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    prisma.deal.aggregate({
      where: { stage: { notIn: ['WON', 'LOST'] } },
      _sum:  { value: true },
    }),
    prisma.deal.groupBy({
      by:     ['assignedToId'],
      _count: { _all: true },
      _sum:   { value: true },
      where:  { stage: 'WON' },
      orderBy: { _sum: { value: 'desc' } },
      take:   5,
    }),
    prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
  ]);

  const wonRevenueThisMonth  = wonThisMonth.reduce((s, d) => s + d.value, 0);
  const wonRevenueLastMonth  = wonLastMonth.reduce((s, d) => s + d.value, 0);
  const revenueGrowth = wonRevenueLastMonth > 0
    ? (((wonRevenueThisMonth - wonRevenueLastMonth) / wonRevenueLastMonth) * 100).toFixed(1)
    : '0';
  const leadGrowth = leadsLastMonth > 0
    ? (((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100).toFixed(1)
    : '0';

  return {
    dealsByStage,
    wonRevenueThisMonth,
    wonRevenueLastMonth,
    revenueGrowth,
    leadsThisMonth,
    leadsLastMonth,
    leadGrowth,
    pipelineValue:  pipelineValue._sum.value ?? 0,
    topPerformers,
    leadsBySource,
  };
}

// ── User Activity Analytics ───────────────────────────────

export async function getActivityAnalytics() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [byType, recent, byUser, completionRate] = await Promise.all([
    prisma.activity.groupBy({ by: ['type'], _count: { _all: true } }),
    prisma.activity.findMany({
      where:   { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'desc' },
      take:    20,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        lead: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
    prisma.activity.groupBy({
      by:      ['userId'],
      _count:  { _all: true },
      where:   { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { _count: { userId: 'desc' } },
      take:    10,
    }),
    prisma.activity.aggregate({
      _count: { completedAt: true },
      where:  { createdAt: { gte: thirtyDaysAgo } },
    }),
  ]);

  const totalActivities = byType.reduce((s, a) => s + a._count._all, 0);
  const completed = completionRate._count.completedAt ?? 0;

  return {
    byType,
    recent,
    byUser,
    totalActivities,
    completionRate: totalActivities > 0
      ? ((completed / totalActivities) * 100).toFixed(1)
      : '0',
  };
}

// ── Platform-wide Dashboard Summary ──────────────────────

export async function getDashboardSummary() {
  const now        = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalClients, activeClients, openTickets, criticalTickets,
    totalMRR, wonThisMonth, newLeads, overdueInvoices,
    recentActivities,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.client.count({ where: { status: 'ACTIVE' } }),
    prisma.ticket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    prisma.ticket.count({ where: { status: 'OPEN', priority: 'CRITICAL' } }),
    prisma.subscription.aggregate({ where: { status: 'ACTIVE' }, _sum: { mrr: true } }),
    prisma.deal.aggregate({ where: { stage: 'WON', closedAt: { gte: monthStart } }, _sum: { value: true } }),
    prisma.lead.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.invoice.count({ where: { status: 'OVERDUE' } }),
    prisma.activity.findMany({
      orderBy: { createdAt: 'desc' },
      take:    10,
      include: { user: { select: { id: true, name: true } } },
    }),
  ]);

  return {
    totalClients, activeClients,
    openTickets, criticalTickets,
    mrr:             totalMRR._sum.mrr ?? 0,
    arr:             (totalMRR._sum.mrr ?? 0) * 12,
    wonRevenueMonth: wonThisMonth._sum.value ?? 0,
    newLeads,
    overdueInvoices,
    recentActivities,
  };
}

// ── Audit Log Writer ──────────────────────────────────────

export async function writeAuditLog(data: {
  userId: string; action: string; resource: string;
  resourceId?: string; metadata?: Record<string, unknown>;
  ipAddress?: string; userAgent?: string;
}) {
  return prisma.auditLog.create({ data });
}
