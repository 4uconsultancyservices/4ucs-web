import type { Client, Project, Ticket, Invoice, Notification, Document } from '@/types';

// ── Clients ──────────────────────────────────────────
export const clients: Client[] = [
  { id: 'c1', name: 'GlobalPay Inc.', industry: 'Fintech', plan: 'Enterprise', mrr: 8500, status: 'active', contact: 'Marcus Rodriguez', email: 'marcus@globalpay.io', country: 'USA', joinedAt: '2023-04-12', avatar: 'GI' },
  { id: 'c2', name: 'HealthFirst Systems', industry: 'Healthcare', plan: 'Enterprise', mrr: 8500, status: 'active', contact: 'Elena Vasquez', email: 'elena@healthfirst.com', country: 'USA', joinedAt: '2023-06-01', avatar: 'HS' },
  { id: 'c3', name: 'RetailFlow', industry: 'E-commerce', plan: 'Global', mrr: 18000, status: 'active', contact: 'David Kim', email: 'david@retailflow.com', country: 'Singapore', joinedAt: '2022-11-15', avatar: 'RF' },
  { id: 'c4', name: 'NovaTech Systems', industry: 'SaaS', plan: 'Growth', mrr: 2500, status: 'active', contact: 'Sarah Chen', email: 'sarah@novatech.io', country: 'Canada', joinedAt: '2024-01-08', avatar: 'NT' },
  { id: 'c5', name: 'Orbit Commerce', industry: 'Commerce', plan: 'Growth', mrr: 2500, status: 'at-risk', contact: 'James Wright', email: 'james@orbit.com', country: 'UK', joinedAt: '2023-09-20', avatar: 'OC' },
  { id: 'c6', name: 'Meridian Analytics', industry: 'Data & BI', plan: 'Enterprise', mrr: 8500, status: 'active', contact: 'Priya Sharma', email: 'priya@meridian.ai', country: 'India', joinedAt: '2023-08-03', avatar: 'MA' },
  { id: 'c7', name: 'Apex Financial', industry: 'Fintech', plan: 'Enterprise', mrr: 8500, status: 'onboarding', contact: 'Chen Wei', email: 'chen@apexfin.com', country: 'China', joinedAt: '2024-04-01', avatar: 'AF' },
  { id: 'c8', name: 'Luminary Health', industry: 'Healthcare', plan: 'Enterprise', mrr: 8500, status: 'active', contact: 'Amara Osei', email: 'amara@luminary.health', country: 'UK', joinedAt: '2023-03-15', avatar: 'LH' },
  { id: 'c9', name: 'ScaleForce Inc.', industry: 'SaaS', plan: 'Global', mrr: 18000, status: 'active', contact: 'Tom Nakamura', email: 'tom@scaleforce.io', country: 'Japan', joinedAt: '2022-08-22', avatar: 'SF' },
  { id: 'c10', name: 'Pinnacle Retail', industry: 'Retail', plan: 'Growth', mrr: 2500, status: 'active', contact: 'Lisa Park', email: 'lisa@pinnacleretail.com', country: 'Korea', joinedAt: '2024-02-14', avatar: 'PR' },
];

// ── Projects ─────────────────────────────────────────
export const projects: Project[] = [
  { id: 'p1', name: 'Cloud Migration Phase 2', clientId: 'c1', clientName: 'GlobalPay Inc.', status: 'active', progress: 78, lead: 'Alex Martinez', startDate: '2026-02-01', dueDate: '2026-06-30', budget: 120000, tags: ['AWS', 'Migration', 'DevOps'] },
  { id: 'p2', name: 'Analytics Dashboard Build', clientId: 'c6', clientName: 'Meridian Analytics', status: 'active', progress: 45, lead: 'Sarah Kim', startDate: '2026-03-15', dueDate: '2026-07-15', budget: 85000, tags: ['BI', 'Recharts', 'Data'] },
  { id: 'p3', name: 'SOC2 Compliance Audit', clientId: 'c2', clientName: 'HealthFirst Systems', status: 'complete', progress: 100, lead: 'James Rivera', startDate: '2026-01-01', dueDate: '2026-03-01', budget: 45000, tags: ['Security', 'Compliance', 'Audit'] },
  { id: 'p4', name: 'API Integration Layer', clientId: 'c3', clientName: 'RetailFlow', status: 'upcoming', progress: 0, lead: 'Priya Sharma', startDate: '2026-07-01', dueDate: '2026-09-30', budget: 95000, tags: ['API', 'Integration', 'Node.js'] },
  { id: 'p5', name: 'AI Chatbot Implementation', clientId: 'c9', clientName: 'ScaleForce Inc.', status: 'active', progress: 30, lead: 'Daniel Lee', startDate: '2026-04-01', dueDate: '2026-08-01', budget: 110000, tags: ['AI', 'LLM', 'Automation'] },
  { id: 'p6', name: 'Mobile App Platform', clientId: 'c4', clientName: 'NovaTech Systems', status: 'on-hold', progress: 55, lead: 'Maria Santos', startDate: '2026-01-15', dueDate: '2026-06-15', budget: 70000, tags: ['Mobile', 'React Native', 'iOS'] },
  { id: 'p7', name: 'Enterprise SSO Setup', clientId: 'c7', clientName: 'Apex Financial', status: 'active', progress: 15, lead: 'Kevin Park', startDate: '2026-04-10', dueDate: '2026-05-30', budget: 25000, tags: ['Auth', 'SSO', 'Security'] },
  { id: 'p8', name: 'Data Warehouse Design', clientId: 'c8', clientName: 'Luminary Health', status: 'complete', progress: 100, lead: 'Rachel Green', startDate: '2025-10-01', dueDate: '2026-01-31', budget: 140000, tags: ['Data', 'BigQuery', 'ETL'] },
];

// ── Tickets ──────────────────────────────────────────
export const tickets: Ticket[] = [
  { id: 'TKT-2041', title: 'API rate limiting configuration', description: 'Production API returning 429s under load. Need rate limit tuning.', clientId: 'c7', clientName: 'Apex Financial', priority: 'critical', status: 'open', assignee: 'Alex Martinez', createdAt: '2026-05-09T08:00:00Z', updatedAt: '2026-05-09T10:00:00Z', tags: ['API', 'Production'] },
  { id: 'TKT-2040', title: 'Dashboard export CSV broken', description: 'Export function fails silently on datasets > 10k rows.', clientId: 'c6', clientName: 'Meridian Analytics', priority: 'high', status: 'in-progress', assignee: 'Sarah Kim', createdAt: '2026-05-08T14:00:00Z', updatedAt: '2026-05-09T09:00:00Z', tags: ['Bug', 'Dashboard'] },
  { id: 'TKT-2039', title: 'SSO integration not working with Okta', description: 'SAML assertion failing for Okta IDP setup.', clientId: 'c1', clientName: 'GlobalPay Inc.', priority: 'high', status: 'open', assignee: 'Kevin Park', createdAt: '2026-05-08T10:00:00Z', updatedAt: '2026-05-08T11:00:00Z', tags: ['Auth', 'SSO'] },
  { id: 'TKT-2038', title: 'Auto-scaling threshold adjustment', description: 'Scale-up trigger too aggressive, causing cost spikes.', clientId: 'c3', clientName: 'RetailFlow', priority: 'medium', status: 'in-progress', assignee: 'James Rivera', createdAt: '2026-05-07T16:00:00Z', updatedAt: '2026-05-09T08:30:00Z', tags: ['Cloud', 'DevOps'] },
  { id: 'TKT-2037', title: 'Billing portal invoice dates wrong', description: 'Invoices showing wrong billing period dates.', clientId: 'c4', clientName: 'NovaTech Systems', priority: 'medium', status: 'resolved', assignee: 'Maria Santos', createdAt: '2026-05-06T09:00:00Z', updatedAt: '2026-05-07T14:00:00Z', tags: ['Billing'] },
  { id: 'TKT-2036', title: 'GDPR data deletion request', description: 'Client requesting GDPR right-to-be-forgotten execution.', clientId: 'c5', clientName: 'Orbit Commerce', priority: 'high', status: 'open', assignee: 'Rachel Green', createdAt: '2026-05-06T11:00:00Z', updatedAt: '2026-05-06T12:00:00Z', tags: ['Compliance', 'GDPR'] },
  { id: 'TKT-2035', title: 'Report generation timeout', description: 'Large reports timing out after 30s. Need query optimization.', clientId: 'c8', clientName: 'Luminary Health', priority: 'low', status: 'resolved', assignee: 'Daniel Lee', createdAt: '2026-05-05T13:00:00Z', updatedAt: '2026-05-06T10:00:00Z', tags: ['Performance'] },
  { id: 'TKT-2034', title: 'Multi-region latency spikes', description: 'APAC users seeing 800ms+ latency. Needs CDN review.', clientId: 'c9', clientName: 'ScaleForce Inc.', priority: 'critical', status: 'in-progress', assignee: 'Alex Martinez', createdAt: '2026-05-04T08:00:00Z', updatedAt: '2026-05-09T09:45:00Z', tags: ['Performance', 'CDN'] },
];

// ── Invoices ─────────────────────────────────────────
export const invoices: Invoice[] = [
  { id: 'INV-2026-051', clientName: 'GlobalPay Inc.', amount: 8500, status: 'paid', issuedAt: '2026-05-01', dueAt: '2026-05-15' },
  { id: 'INV-2026-050', clientName: 'RetailFlow', amount: 18000, status: 'paid', issuedAt: '2026-05-01', dueAt: '2026-05-15' },
  { id: 'INV-2026-049', clientName: 'ScaleForce Inc.', amount: 18000, status: 'pending', issuedAt: '2026-05-01', dueAt: '2026-05-20' },
  { id: 'INV-2026-048', clientName: 'NovaTech Systems', amount: 2500, status: 'paid', issuedAt: '2026-05-01', dueAt: '2026-05-15' },
  { id: 'INV-2026-047', clientName: 'Orbit Commerce', amount: 2500, status: 'overdue', issuedAt: '2026-04-01', dueAt: '2026-04-15' },
  { id: 'INV-2026-046', clientName: 'Meridian Analytics', amount: 8500, status: 'paid', issuedAt: '2026-04-01', dueAt: '2026-04-15' },
  { id: 'INV-2026-045', clientName: 'HealthFirst Systems', amount: 8500, status: 'paid', issuedAt: '2026-04-01', dueAt: '2026-04-15' },
  { id: 'INV-2026-044', clientName: 'Luminary Health', amount: 8500, status: 'draft', issuedAt: '2026-05-08', dueAt: '2026-06-01' },
];

// ── Notifications ─────────────────────────────────────
export const notifications: Notification[] = [
  { id: 'n1', type: 'success', title: 'Deployment successful', description: 'RetailFlow production v2.3.1 deployed with zero downtime.', read: false, createdAt: '2026-05-09T10:02:00Z' },
  { id: 'n2', type: 'info', title: 'New enterprise signup', description: 'Pinnacle Retail signed up for Enterprise plan ($8,500/mo).', read: false, createdAt: '2026-05-09T09:15:00Z' },
  { id: 'n3', type: 'error', title: 'Critical ticket opened', description: 'TKT-2041: API rate limiting issue at Apex Financial.', read: false, createdAt: '2026-05-09T08:00:00Z' },
  { id: 'n4', type: 'warning', title: 'Invoice overdue', description: 'INV-2026-047 from Orbit Commerce is 24 days overdue.', read: true, createdAt: '2026-05-08T16:00:00Z' },
  { id: 'n5', type: 'success', title: 'SOC2 audit passed', description: 'HealthFirst Systems SOC2 Type II — 0 critical findings.', read: true, createdAt: '2026-05-08T14:30:00Z' },
  { id: 'n6', type: 'info', title: 'Monthly MRR report ready', description: 'April 2026 MRR report is available for review.', read: true, createdAt: '2026-05-08T09:00:00Z' },
  { id: 'n7', type: 'warning', title: 'Client at risk', description: 'Orbit Commerce showing churn indicators. Action needed.', read: true, createdAt: '2026-05-07T11:00:00Z' },
  { id: 'n8', type: 'info', title: 'Team standup reminder', description: 'Daily standup starts in 15 minutes.', read: true, createdAt: '2026-05-09T09:45:00Z' },
];

// ── Documents ─────────────────────────────────────────
export const documents: Document[] = [
  { id: 'd1', name: 'GlobalPay Architecture Blueprint v3.pdf', type: 'pdf', size: '4.2 MB', clientName: 'GlobalPay Inc.', uploadedBy: 'Alex Martinez', uploadedAt: '2026-05-05', url: '#' },
  { id: 'd2', name: 'HealthFirst SOC2 Report 2026.pdf', type: 'pdf', size: '2.8 MB', clientName: 'HealthFirst Systems', uploadedBy: 'James Rivera', uploadedAt: '2026-04-28', url: '#' },
  { id: 'd3', name: 'Q2 2026 Strategy Roadmap.docx', type: 'doc', size: '1.1 MB', uploadedBy: 'Admin', uploadedAt: '2026-04-15', url: '#' },
  { id: 'd4', name: 'RetailFlow API Integration Guide.pdf', type: 'pdf', size: '3.6 MB', clientName: 'RetailFlow', uploadedBy: 'Priya Sharma', uploadedAt: '2026-04-10', url: '#' },
  { id: 'd5', name: 'Enterprise SLA Template 2026.pdf', type: 'pdf', size: '0.8 MB', uploadedBy: 'Admin', uploadedAt: '2026-03-20', url: '#' },
  { id: 'd6', name: 'ScaleForce AI Implementation Report.pdf', type: 'pdf', size: '5.1 MB', clientName: 'ScaleForce Inc.', uploadedBy: 'Daniel Lee', uploadedAt: '2026-05-02', url: '#' },
  { id: 'd7', name: 'Monthly KPI Dashboard April 2026.xlsx', type: 'xls', size: '2.3 MB', uploadedBy: 'Admin', uploadedAt: '2026-05-01', url: '#' },
  { id: 'd8', name: 'NovaTech Mobile App Spec.pdf', type: 'pdf', size: '6.2 MB', clientName: 'NovaTech Systems', uploadedBy: 'Maria Santos', uploadedAt: '2026-02-18', url: '#' },
];

// ── Revenue / Analytics seed data ─────────────────────
export const revenueTimeSeries = [
  { month: 'Jan', mrr: 210, arr: 2520, clients: 45, churn: 2 },
  { month: 'Feb', mrr: 245, arr: 2940, clients: 52, churn: 1 },
  { month: 'Mar', mrr: 280, arr: 3360, clients: 61, churn: 3 },
  { month: 'Apr', mrr: 320, arr: 3840, clients: 67, churn: 2 },
  { month: 'May', mrr: 290, arr: 3480, clients: 71, churn: 4 },
  { month: 'Jun', mrr: 380, arr: 4560, clients: 84, churn: 1 },
  { month: 'Jul', mrr: 420, arr: 5040, clients: 92, churn: 2 },
  { month: 'Aug', mrr: 460, arr: 5520, clients: 108, churn: 1 },
];

export const pipelineStages = [
  { name: 'Prospect', count: 24, value: 840000, color: '#60b0ff' },
  { name: 'Qualified', count: 16, value: 620000, color: '#0066ff' },
  { name: 'Proposal', count: 11, value: 440000, color: '#7c3aed' },
  { name: 'Negotiation', count: 7, value: 315000, color: '#22d3ee' },
  { name: 'Won', count: 5, value: 225000, color: '#10b981' },
];
