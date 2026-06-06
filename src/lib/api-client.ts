'use client';

// ─────────────────────────────────────────────────────────────
// Typed API client used by all client-side components
// Handles auth headers, error normalisation, and JSON parsing
// ─────────────────────────────────────────────────────────────

const BASE = '';  // same-origin Next.js App Router

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<{ data: T; meta?: Record<string, unknown> }> {
  const token =
    typeof document !== 'undefined'
      ? document.cookie
          .split('; ')
          .find((c) => c.startsWith('4ucs_token='))
          ?.split('=')[1]
      : undefined;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new ApiError(err.error ?? 'Request failed', res.status, err.errors);
  }

  if (res.status === 204) return { data: null as T };
  return res.json();
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function get<T>(path: string)                    { return request<T>(path, { method: 'GET' }); }
function post<T>(path: string, body: unknown)    { return request<T>(path, { method: 'POST',  body: JSON.stringify(body) }); }
function patch<T>(path: string, body: unknown)   { return request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }); }
function del<T>(path: string)                    { return request<T>(path, { method: 'DELETE' }); }

function qs(params: Record<string, string | number | boolean | undefined>): string {
  const p = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return p ? `?${p}` : '';
}

// ── Auth ─────────────────────────────────────────────────────
export const authApi = {
  login:    (body: { email: string; password: string })  => post('/api/auth/login',    body),
  register: (body: { name: string; email: string; password: string; role?: string }) =>
                                                           post('/api/auth/register',  body),
};

// ── CRM / Leads ───────────────────────────────────────────────
export const leadsApi = {
  list: (params: {
    page?: number; limit?: number; search?: string;
    status?: string; source?: string; assignedToId?: string;
  } = {}) => get(`/api/crm/leads${qs(params)}`),

  stats:  ()                   => get('/api/crm/leads?stats=true'),
  getOne: (id: string)         => get(`/api/crm/leads/${id}`),
  create: (body: unknown)      => post('/api/crm/leads', body),
  update: (id: string, body: unknown) => patch(`/api/crm/leads/${id}`, body),
  remove: (id: string)         => del(`/api/crm/leads/${id}`),
};

// ── Activities ────────────────────────────────────────────────
export const activitiesApi = {
  list: (params: {
    leadId?: string; dealId?: string; clientId?: string;
    userId?: string; page?: number; limit?: number;
  } = {}) => get(`/api/crm/activities${qs(params)}`),

  create:   (body: unknown) => post('/api/crm/activities', body),
  complete: (id: string)    => patch(`/api/crm/activities/${id}`, { action: 'complete' }),
  remove:   (id: string)    => del(`/api/crm/activities/${id}`),
};

// ── Sales / Deals ─────────────────────────────────────────────
export const dealsApi = {
  list: (params: {
    page?: number; limit?: number; search?: string;
    stage?: string; assignedToId?: string; clientId?: string;
  } = {}) => get(`/api/sales/deals${qs(params)}`),

  getOne:      (id: string)                   => get(`/api/sales/deals/${id}`),
  create:      (body: unknown)                => post('/api/sales/deals', body),
  update:      (id: string, body: unknown)    => patch(`/api/sales/deals/${id}`, body),
  updateStage: (id: string, body: unknown)    => patch(`/api/sales/deals/${id}`, { ...body as object, stageOnly: true }),
  remove:      (id: string)                   => del(`/api/sales/deals/${id}`),
  pipeline:    ()                             => get('/api/sales/pipeline'),
  performance: (params: { start?: string; end?: string } = {}) =>
                                                get(`/api/sales/performance${qs(params)}`),
};

// ── Marketing ─────────────────────────────────────────────────
export const campaignsApi = {
  list: (params: {
    page?: number; limit?: number; search?: string;
    status?: string; type?: string;
  } = {}) => get(`/api/marketing/campaigns${qs(params)}`),

  analytics: ()                             => get('/api/marketing/campaigns?analytics=true'),
  getOne:    (id: string)                   => get(`/api/marketing/campaigns/${id}`),
  stats:     (id: string)                   => get(`/api/marketing/campaigns/${id}?stats=true`),
  create:    (body: unknown)                => post('/api/marketing/campaigns', body),
  update:    (id: string, body: unknown)    => patch(`/api/marketing/campaigns/${id}`, body),
  remove:    (id: string)                   => del(`/api/marketing/campaigns/${id}`),
};

export const segmentsApi = {
  list:   (params: { page?: number; search?: string } = {}) =>
            get(`/api/marketing/segments${qs(params)}`),
  create: (body: unknown) => post('/api/marketing/segments', body),
};

export const funnelsApi = {
  get: (campaignId: string) => get(`/api/marketing/funnels?campaignId=${campaignId}`),
};

// ── Client Management ─────────────────────────────────────────
export const clientsApi = {
  list: (params: {
    page?: number; limit?: number; search?: string;
    status?: string; plan?: string;
  } = {}) => get(`/api/client/clients${qs(params)}`),

  getOne: (id: string)                => get(`/api/client/clients/${id}`),
  create: (body: unknown)             => post('/api/client/clients', body),
  update: (id: string, body: unknown) => patch(`/api/client/clients/${id}`, body),
  remove: (id: string)                => del(`/api/client/clients/${id}`),
};

export const projectsApi = {
  list: (params: {
    page?: number; limit?: number; search?: string;
    clientId?: string; status?: string;
  } = {}) => get(`/api/client/projects${qs(params)}`),

  getOne: (id: string)                => get(`/api/client/projects/${id}`),
  create: (body: unknown)             => post('/api/client/projects', body),
  update: (id: string, body: unknown) => patch(`/api/client/projects/${id}`, body),
  remove: (id: string)                => del(`/api/client/projects/${id}`),
};

export const ticketsApi = {
  list: (params: {
    page?: number; limit?: number; search?: string;
    clientId?: string; status?: string; priority?: string; assignedToId?: string;
  } = {}) => get(`/api/client/tickets${qs(params)}`),

  getOne:     (id: string)                              => get(`/api/client/tickets/${id}`),
  create:     (body: unknown)                           => post('/api/client/tickets', body),
  update:     (id: string, body: unknown)               => patch(`/api/client/tickets/${id}`, body),
  addComment: (id: string, body: { body: string; isInternal?: boolean }) =>
                                                           patch(`/api/client/tickets/${id}`, { ...body, action: 'comment' }),
  remove:     (id: string)                              => del(`/api/client/tickets/${id}`),
};

export const documentsApi = {
  list: (params: {
    page?: number; limit?: number; search?: string;
    clientId?: string; projectId?: string; fileType?: string;
  } = {}) => get(`/api/client/documents${qs(params)}`),

  create: (body: unknown) => post('/api/client/documents', body),
  remove: (id: string)    => del(`/api/client/documents/${id}`),
};

// ── Billing ───────────────────────────────────────────────────
export const invoicesApi = {
  list: (params: {
    page?: number; limit?: number; clientId?: string; status?: string;
  } = {}) => get(`/api/billing/invoices${qs(params)}`),

  summary:  ()                              => get('/api/billing/invoices?summary=true'),
  getOne:   (id: string)                    => get(`/api/billing/invoices/${id}`),
  create:   (body: unknown)                 => post('/api/billing/invoices', body),
  update:   (id: string, body: unknown)     => patch(`/api/billing/invoices/${id}`, body),
  markPaid: (id: string, method?: string)   => patch(`/api/billing/invoices/${id}`, { action: 'mark_paid', method }),
  remove:   (id: string)                    => del(`/api/billing/invoices/${id}`),
};

export const subscriptionsApi = {
  list:   (params: { page?: number; clientId?: string; status?: string; plan?: string } = {}) =>
            get(`/api/billing/subscriptions${qs(params)}`),
  create: (body: unknown)  => post('/api/billing/subscriptions', body),
  cancel: (id: string)     => post('/api/billing/subscriptions', { action: 'cancel', id }),
};

export const paymentsApi = {
  list: (params: { page?: number; invoiceId?: string } = {}) =>
          get(`/api/billing/payments${qs(params)}`),
};

// ── Analytics ─────────────────────────────────────────────────
export const analyticsApi = {
  dashboard:  ()                                    => get('/api/analytics/dashboard'),
  revenue:    (period: 'month'|'quarter'|'year' = 'year') =>
                                                       get(`/api/analytics/revenue?period=${period}`),
  sales:      ()                                    => get('/api/analytics/sales'),
  marketing:  ()                                    => get('/api/analytics/marketing'),
  activity:   ()                                    => get('/api/analytics/activity'),
};

// ── Health ────────────────────────────────────────────────────
export const systemApi = {
  health: () => get('/api/health'),
};
