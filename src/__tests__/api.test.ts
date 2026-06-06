/**
 * API route integration tests (mock fetch)
 */

// Mock the data module
jest.mock('@/lib/data', () => ({
  clients: [
    { id: 'c1', name: 'GlobalPay Inc.', industry: 'Fintech', plan: 'Enterprise', mrr: 8500, status: 'active', contact: 'Marcus Rodriguez', email: 'marcus@globalpay.io', country: 'USA', joinedAt: '2023-04-12', avatar: 'GI' },
    { id: 'c2', name: 'NovaTech', industry: 'SaaS', plan: 'Growth', mrr: 2500, status: 'at-risk', contact: 'Sarah Chen', email: 'sarah@novatech.io', country: 'Canada', joinedAt: '2024-01-08', avatar: 'NT' },
  ],
  tickets: [
    { id: 'TKT-001', title: 'API issue', description: 'Test', clientId: 'c1', clientName: 'GlobalPay', priority: 'high', status: 'open', assignee: 'Dev', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: [] },
  ],
}));

describe('API: /api/health', () => {
  it('returns status ok', async () => {
    const { GET } = await import('@/app/api/health/route');
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.status).toBe('ok');
    expect(json.version).toBe('1.0.0');
    expect(typeof json.timestamp).toBe('string');
  });
});

describe('API: /api/clients', () => {
  it('GET returns all clients', async () => {
    const { GET } = await import('@/app/api/clients/route');
    const req = new Request('http://localhost:3000/api/clients');
    const response = await GET(req as Parameters<typeof GET>[0]);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.total).toBe(2);
  });

  it('GET filters by status', async () => {
    const { GET } = await import('@/app/api/clients/route');
    const req = new Request('http://localhost:3000/api/clients?status=active');
    const response = await GET(req as Parameters<typeof GET>[0]);
    const json = await response.json();

    expect(json.data.every((c: { status: string }) => c.status === 'active')).toBe(true);
  });

  it('POST creates a new client', async () => {
    const { POST } = await import('@/app/api/clients/route');
    const req = new Request('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Corp', email: 'test@test.com', industry: 'Tech', plan: 'Growth' }),
    });
    const response = await POST(req as Parameters<typeof POST>[0]);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.data.name).toBe('Test Corp');
    expect(json.data.email).toBe('test@test.com');
    expect(json.data.status).toBe('onboarding');
  });

  it('POST returns 400 when name is missing', async () => {
    const { POST } = await import('@/app/api/clients/route');
    const req = new Request('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com' }),
    });
    const response = await POST(req as Parameters<typeof POST>[0]);
    expect(response.status).toBe(400);
  });
});

describe('API: /api/tickets', () => {
  it('GET returns all tickets', async () => {
    const { GET } = await import('@/app/api/tickets/route');
    const req = new Request('http://localhost:3000/api/tickets');
    const response = await GET(req as Parameters<typeof GET>[0]);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
  });

  it('POST creates a ticket', async () => {
    const { POST } = await import('@/app/api/tickets/route');
    const req = new Request('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New bug', clientId: 'c1', clientName: 'GlobalPay', priority: 'medium' }),
    });
    const response = await POST(req as Parameters<typeof POST>[0]);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.data.title).toBe('New bug');
    expect(json.data.status).toBe('open');
  });
});
