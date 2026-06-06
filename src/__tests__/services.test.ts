jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    lead:   { findMany:jest.fn(), findUnique:jest.fn(), create:jest.fn(), update:jest.fn(), delete:jest.fn(), count:jest.fn(), groupBy:jest.fn(), aggregate:jest.fn() },
    deal:   { findMany:jest.fn(), findUnique:jest.fn(), create:jest.fn(), update:jest.fn(), delete:jest.fn(), count:jest.fn(), groupBy:jest.fn(), aggregate:jest.fn() },
    ticket: { findMany:jest.fn(), findUnique:jest.fn(), create:jest.fn(), update:jest.fn(), delete:jest.fn(), count:jest.fn() },
    invoice:{ findMany:jest.fn(), findUnique:jest.fn(), create:jest.fn(), update:jest.fn(), delete:jest.fn(), count:jest.fn(), groupBy:jest.fn(), aggregate:jest.fn() },
    campaign:{ findMany:jest.fn(), findUnique:jest.fn(), create:jest.fn(), update:jest.fn(), delete:jest.fn(), count:jest.fn(), groupBy:jest.fn() },
    client: { findMany:jest.fn(), findUnique:jest.fn(), create:jest.fn(), update:jest.fn(), delete:jest.fn(), count:jest.fn() },
    subscription:{ findMany:jest.fn(), count:jest.fn(), create:jest.fn(), update:jest.fn(), aggregate:jest.fn(), groupBy:jest.fn() },
    activity:{ findMany:jest.fn(), create:jest.fn(), update:jest.fn(), delete:jest.fn(), count:jest.fn(), groupBy:jest.fn(), aggregate:jest.fn() },
    analyticsSnapshot:{ findMany:jest.fn(), upsert:jest.fn() },
    auditLog:{ create:jest.fn() },
    payment:{ findMany:jest.fn(), create:jest.fn(), count:jest.fn() },
    ticketComment:{ create:jest.fn() },
    $transaction: jest.fn(),
  },
}));

import prisma from '@/lib/prisma';
const mp = prisma as jest.Mocked<typeof prisma>;

describe('getLeads — pagination', () => {
  beforeEach(() => jest.clearAllMocks());
  it('returns paginated data', async () => {
    const { getLeads } = await import('@/lib/services/crm.service');
    (mp.lead.findMany as jest.Mock).mockResolvedValue([{ id:'l1', firstName:'John', lastName:'Doe', email:'j@c.com', status:'NEW' }]);
    (mp.lead.count as jest.Mock).mockResolvedValue(1);
    const r = await getLeads({ page:1, limit:20, sortDir:'desc' });
    expect(r.data).toHaveLength(1); expect(r.total).toBe(1); expect(r.page).toBe(1);
  });
  it('applies search filter', async () => {
    const { getLeads } = await import('@/lib/services/crm.service');
    (mp.lead.findMany as jest.Mock).mockResolvedValue([]); (mp.lead.count as jest.Mock).mockResolvedValue(0);
    await getLeads({ page:1, limit:20, sortDir:'desc', search:'acme' });
    expect((mp.lead.findMany as jest.Mock).mock.calls[0][0].where.OR).toBeDefined();
  });
  it('calculates totalPages', async () => {
    const { getLeads } = await import('@/lib/services/crm.service');
    (mp.lead.findMany as jest.Mock).mockResolvedValue([]); (mp.lead.count as jest.Mock).mockResolvedValue(45);
    const r = await getLeads({ page:1, limit:20, sortDir:'desc' });
    expect(r.totalPages).toBe(3);
  });
});

describe('createLead', () => {
  beforeEach(() => jest.clearAllMocks());
  it('attaches createdById', async () => {
    const { createLead } = await import('@/lib/services/crm.service');
    (mp.lead.create as jest.Mock).mockResolvedValue({ id:'l1' });
    await createLead({ firstName:'Jane', lastName:'Smith', email:'j@s.com', status:'NEW', score:0 }, 'user-1');
    expect((mp.lead.create as jest.Mock).mock.calls[0][0].data.createdById).toBe('user-1');
  });
});

describe('getPipelineBoard', () => {
  beforeEach(() => jest.clearAllMocks());
  it('groups deals by stage', async () => {
    const { getPipelineBoard } = await import('@/lib/services/sales.service');
    (mp.deal.findMany as jest.Mock).mockResolvedValue([
      { id:'d1', title:'A', value:50000, stage:'PROSPECT', probability:20, assignedTo:null, client:null },
      { id:'d2', title:'B', value:80000, stage:'QUALIFIED', probability:60, assignedTo:null, client:null },
    ]);
    const board = await getPipelineBoard();
    const p = board.find(b => b.stage === 'PROSPECT');
    expect(p?.deals).toHaveLength(1); expect(p?.totalValue).toBe(50000);
  });
});

describe('updateDealStage — closedAt logic', () => {
  beforeEach(() => jest.clearAllMocks());
  it('sets closedAt when WON', async () => {
    const { updateDealStage } = await import('@/lib/services/sales.service');
    (mp.deal.update as jest.Mock).mockResolvedValue({ id:'d1', stage:'WON' });
    await updateDealStage('d1', { stage:'WON', probability:100 });
    expect((mp.deal.update as jest.Mock).mock.calls[0][0].data.closedAt).toBeInstanceOf(Date);
  });
  it('does NOT set closedAt for PROPOSAL', async () => {
    const { updateDealStage } = await import('@/lib/services/sales.service');
    (mp.deal.update as jest.Mock).mockResolvedValue({ id:'d1', stage:'PROPOSAL' });
    await updateDealStage('d1', { stage:'PROPOSAL', probability:50 });
    expect((mp.deal.update as jest.Mock).mock.calls[0][0].data.closedAt).toBeUndefined();
  });
});

describe('createClient — MRR from plan', () => {
  beforeEach(() => jest.clearAllMocks());
  it('ENTERPRISE = 8500', async () => {
    const { createClient } = await import('@/lib/services/client.service');
    (mp.client.create as jest.Mock).mockResolvedValue({ id:'c1', mrr:8500 });
    await createClient({ name:'Corp', plan:'ENTERPRISE' });
    expect((mp.client.create as jest.Mock).mock.calls[0][0].data.mrr).toBe(8500);
  });
  it('GROWTH = 2500', async () => {
    const { createClient } = await import('@/lib/services/client.service');
    (mp.client.create as jest.Mock).mockResolvedValue({ id:'c2', mrr:2500 });
    await createClient({ name:'Startup', plan:'GROWTH' });
    expect((mp.client.create as jest.Mock).mock.calls[0][0].data.mrr).toBe(2500);
  });
  it('GLOBAL = 18000', async () => {
    const { createClient } = await import('@/lib/services/client.service');
    (mp.client.create as jest.Mock).mockResolvedValue({ id:'c3', mrr:18000 });
    await createClient({ name:'BigCorp', plan:'GLOBAL' });
    expect((mp.client.create as jest.Mock).mock.calls[0][0].data.mrr).toBe(18000);
  });
});

describe('RBAC — hasPermission', () => {
  it('SUPER_ADMIN passes all', async () => {
    const { hasPermission } = await import('@/lib/rbac');
    expect(hasPermission('SUPER_ADMIN','crm:leads:delete')).toBe(true);
    expect(hasPermission('SUPER_ADMIN','users:delete')).toBe(true);
    expect(hasPermission('SUPER_ADMIN','billing:invoices:delete')).toBe(true);
  });
  it('CLIENT denied crm:leads:read', async () => {
    const { hasPermission } = await import('@/lib/rbac');
    expect(hasPermission('CLIENT','crm:leads:read')).toBe(false);
  });
  it('CLIENT allowed billing:invoices:read', async () => {
    const { hasPermission } = await import('@/lib/rbac');
    expect(hasPermission('CLIENT','billing:invoices:read')).toBe(true);
  });
  it('SALES allowed crm:leads:create', async () => {
    const { hasPermission } = await import('@/lib/rbac');
    expect(hasPermission('SALES','crm:leads:create')).toBe(true);
  });
  it('SALES denied crm:leads:delete', async () => {
    const { hasPermission } = await import('@/lib/rbac');
    expect(hasPermission('SALES','crm:leads:delete')).toBe(false);
  });
  it('MARKETING denied sales:deals:create', async () => {
    const { hasPermission } = await import('@/lib/rbac');
    expect(hasPermission('MARKETING','sales:deals:create')).toBe(false);
  });
});

describe('RBAC — isRoleAtLeast', () => {
  it('SUPER_ADMIN >= ADMIN', async () => { const { isRoleAtLeast } = await import('@/lib/rbac'); expect(isRoleAtLeast('SUPER_ADMIN','ADMIN')).toBe(true); });
  it('CLIENT NOT >= SALES',  async () => { const { isRoleAtLeast } = await import('@/lib/rbac'); expect(isRoleAtLeast('CLIENT','SALES')).toBe(false); });
  it('ADMIN NOT >= SUPER_ADMIN', async () => { const { isRoleAtLeast } = await import('@/lib/rbac'); expect(isRoleAtLeast('ADMIN','SUPER_ADMIN')).toBe(false); });
});
