import { clients, tickets, invoices, documents, notifications, projects, revenueTimeSeries, pipelineStages } from '@/lib/data';

describe('Data integrity: clients', () => {
  it('has at least 5 clients', () => expect(clients.length).toBeGreaterThanOrEqual(5));
  it('every client has required fields', () => {
    clients.forEach(c => {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.email).toMatch(/@/);
      expect(['active','onboarding','at-risk','churned','prospect']).toContain(c.status);
      expect(['Growth','Enterprise','Global']).toContain(c.plan);
      expect(typeof c.mrr).toBe('number');
      expect(c.mrr).toBeGreaterThan(0);
    });
  });
  it('MRR matches plan tier', () => {
    clients.forEach(c => {
      if (c.plan === 'Growth')     expect(c.mrr).toBe(2500);
      if (c.plan === 'Enterprise') expect(c.mrr).toBe(8500);
      if (c.plan === 'Global')     expect(c.mrr).toBe(18000);
    });
  });
});

describe('Data integrity: tickets', () => {
  it('has at least 5 tickets', () => expect(tickets.length).toBeGreaterThanOrEqual(5));
  it('every ticket has required fields', () => {
    tickets.forEach(t => {
      expect(t.id).toMatch(/^TKT-/);
      expect(t.title).toBeTruthy();
      expect(t.clientId).toBeTruthy();
      expect(['critical','high','medium','low']).toContain(t.priority);
      expect(['open','in-progress','resolved','closed','waiting']).toContain(t.status);
    });
  });
});

describe('Data integrity: invoices', () => {
  it('has at least 4 invoices', () => expect(invoices.length).toBeGreaterThanOrEqual(4));
  it('every invoice has positive amount', () => {
    invoices.forEach(inv => expect(inv.amount).toBeGreaterThan(0));
  });
  it('every invoice has valid status', () => {
    invoices.forEach(inv => {
      expect(['paid','pending','overdue','draft']).toContain(inv.status);
    });
  });
});

describe('Data integrity: documents', () => {
  it('has at least 4 documents', () => expect(documents.length).toBeGreaterThanOrEqual(4));
  it('every document has type and name', () => {
    documents.forEach(d => {
      expect(d.name).toBeTruthy();
      expect(['pdf','doc','xls','ppt','zip']).toContain(d.type);
    });
  });
});

describe('Data integrity: notifications', () => {
  it('has at least 4 notifications', () => expect(notifications.length).toBeGreaterThanOrEqual(4));
  it('every notification has required type', () => {
    notifications.forEach(n => {
      expect(['success','warning','error','info']).toContain(n.type);
    });
  });
  it('has some unread notifications', () => {
    expect(notifications.some(n => !n.read)).toBe(true);
  });
});

describe('Data integrity: projects', () => {
  it('has at least 4 projects', () => expect(projects.length).toBeGreaterThanOrEqual(4));
  it('progress is between 0 and 100', () => {
    projects.forEach(p => {
      expect(p.progress).toBeGreaterThanOrEqual(0);
      expect(p.progress).toBeLessThanOrEqual(100);
    });
  });
  it('status is valid', () => {
    projects.forEach(p => {
      expect(['active','complete','upcoming','on-hold','cancelled']).toContain(p.status);
    });
  });
});

describe('Data integrity: revenue time series', () => {
  it('has 8 data points', () => expect(revenueTimeSeries).toHaveLength(8));
  it('MRR increases over time (generally)', () => {
    const first = revenueTimeSeries[0].mrr;
    const last  = revenueTimeSeries[revenueTimeSeries.length - 1].mrr;
    expect(last).toBeGreaterThan(first);
  });
});

describe('Data integrity: pipeline stages', () => {
  it('has 5 stages', () => expect(pipelineStages).toHaveLength(5));
  it('all stage counts are positive', () => {
    pipelineStages.forEach(s => expect(s.count).toBeGreaterThan(0));
  });
  it('prospect has most deals', () => {
    const prospect = pipelineStages.find(s => s.name === 'Prospect');
    const won      = pipelineStages.find(s => s.name === 'Won');
    expect(prospect!.count).toBeGreaterThan(won!.count);
  });
});
