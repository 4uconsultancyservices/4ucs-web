import prisma from '@/lib/prisma';
import type { CreateInvoiceInput, UpdateInvoiceInput, CreateSubscriptionInput, PaginationInput } from '@/lib/validations';

// ── Invoice Services ──────────────────────────────────────

let invoiceCounter = 60;
async function generateInvoiceNumber(): Promise<string> {
  const last = await prisma.invoice.findFirst({ orderBy: { createdAt: 'desc' }, select: { invoiceNumber: true } });
  if (last) {
    const num = parseInt(last.invoiceNumber.split('-')[2] ?? '60', 10);
    invoiceCounter = Math.max(invoiceCounter, num);
  }
  const year = new Date().getFullYear();
  return `INV-${year}-${String(++invoiceCounter).padStart(3, '0')}`;
}

export async function getInvoices(filters: PaginationInput & { clientId?: string; status?: string }) {
  const { page = 1, limit = 20, search, sortBy = 'createdAt', sortDir = 'desc', clientId, status } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(search   && { invoiceNumber: { contains: search, mode: 'insensitive' as const } }),
    ...(clientId && { clientId }),
    ...(status   && { status: status as any }),
  };

  const [data, total] = await Promise.all([
    prisma.invoice.findMany({
      where, skip, take: limit,
      orderBy: { [sortBy]: sortDir },
      include: {
        client:   { select: { id: true, name: true } },
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    }),
    prisma.invoice.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getInvoiceById(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      client:       { select: { id: true, name: true, address: true, country: true } },
      subscription: { select: { id: true, plan: true } },
      payments:     { orderBy: { createdAt: 'desc' } },
    },
  });
}

export async function createInvoice(data: CreateInvoiceInput) {
  const invoiceNumber = await generateInvoiceNumber();
  const total = data.amount + data.tax;
  return prisma.invoice.create({
    data: {
      ...data,
      invoiceNumber,
      total,
      dueDate: new Date(data.dueDate),
    },
    include: { client: { select: { id: true, name: true } } },
  });
}

export async function updateInvoice(id: string, data: UpdateInvoiceInput) {
  return prisma.invoice.update({
    where: { id },
    data: {
      ...data,
      ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
      ...(data.paidAt  && { paidAt:  new Date(data.paidAt)  }),
    },
  });
}

export async function deleteInvoice(id: string) {
  return prisma.invoice.delete({ where: { id } });
}

export async function markInvoicePaid(id: string, method?: string) {
  const [invoice, payment] = await prisma.$transaction([
    prisma.invoice.update({
      where: { id },
      data: { status: 'PAID', paidAt: new Date() },
    }),
    prisma.payment.create({
      data: {
        invoiceId:   id,
        amount:      (await prisma.invoice.findUnique({ where: { id }, select: { total: true } }))!.total,
        status:      'COMPLETED',
        method:      method ?? 'card',
        processedAt: new Date(),
      },
    }),
  ]);
  return { invoice, payment };
}

// ── Subscription Services ─────────────────────────────────

export async function getSubscriptions(filters: PaginationInput & { clientId?: string; status?: string; plan?: string }) {
  const { page = 1, limit = 20, clientId, status, plan } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(clientId && { clientId }),
    ...(status   && { status: status as any }),
    ...(plan     && { plan:   plan   as any }),
  };

  const [data, total] = await Promise.all([
    prisma.subscription.findMany({
      where, skip, take: limit,
      orderBy: { createdAt: 'desc' },
      include: { client: { select: { id: true, name: true, industry: true } } },
    }),
    prisma.subscription.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createSubscription(data: CreateSubscriptionInput) {
  const mrrMap = { GROWTH: 2500, ENTERPRISE: 8500, GLOBAL: 18000 };
  const mrr = mrrMap[data.plan];

  const [subscription] = await prisma.$transaction([
    prisma.subscription.create({
      data: {
        ...data,
        mrr,
        currentPeriodStart: new Date(data.currentPeriodStart),
        currentPeriodEnd:   new Date(data.currentPeriodEnd),
        trialEnds:          data.trialEnds ? new Date(data.trialEnds) : undefined,
      },
    }),
    prisma.client.update({
      where: { id: data.clientId },
      data:  { mrr, plan: data.plan },
    }),
  ]);

  return subscription;
}

export async function cancelSubscription(id: string) {
  return prisma.subscription.update({
    where: { id },
    data:  { status: 'CANCELLED', cancelledAt: new Date() },
  });
}

// ── Payments ──────────────────────────────────────────────

export async function getPayments(filters: PaginationInput & { invoiceId?: string }) {
  const { page = 1, limit = 20, invoiceId } = filters;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.payment.findMany({
      where: invoiceId ? { invoiceId } : {},
      skip, take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        invoice: {
          select: {
            id: true, invoiceNumber: true,
            client: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.payment.count({ where: invoiceId ? { invoiceId } : {} }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ── Billing Summary ───────────────────────────────────────

export async function getBillingSummary() {
  const [
    totalMRR, invoicesByStatus, recentPayments, overdueInvoices,
  ] = await Promise.all([
    prisma.subscription.aggregate({ where: { status: 'ACTIVE' }, _sum: { mrr: true } }),
    prisma.invoice.groupBy({ by: ['status'], _count: { _all: true }, _sum: { total: true } }),
    prisma.payment.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { processedAt: 'desc' },
      take: 10,
      include: { invoice: { select: { invoiceNumber: true, client: { select: { name: true } } } } },
    }),
    prisma.invoice.count({ where: { status: 'OVERDUE' } }),
  ]);

  return {
    mrr:            totalMRR._sum.mrr ?? 0,
    arr:            (totalMRR._sum.mrr ?? 0) * 12,
    invoicesByStatus,
    recentPayments,
    overdueInvoices,
  };
}
