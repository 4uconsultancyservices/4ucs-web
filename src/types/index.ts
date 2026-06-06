// ── Navigation ──────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ElementType;
  badge?: string | number;
  children?: NavItem[];
}

// ── Clients / CRM ───────────────────────────────────
export type ClientStatus = 'active' | 'onboarding' | 'at-risk' | 'churned' | 'prospect';
export type ClientPlan = 'Growth' | 'Enterprise' | 'Global';

export interface Client {
  id: string;
  name: string;
  industry: string;
  plan: ClientPlan;
  mrr: number;
  status: ClientStatus;
  contact: string;
  email: string;
  country: string;
  joinedAt: string;
  avatar?: string;
}

// ── Projects ────────────────────────────────────────
export type ProjectStatus = 'active' | 'complete' | 'upcoming' | 'on-hold' | 'cancelled';

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  status: ProjectStatus;
  progress: number;
  lead: string;
  startDate: string;
  dueDate: string;
  budget: number;
  tags: string[];
}

// ── Tickets ─────────────────────────────────────────
export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed' | 'waiting';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

// ── Analytics ───────────────────────────────────────
export interface MetricPoint {
  date: string;
  value: number;
}

export interface Stat {
  label: string;
  value: number | string;
  change: number;
  prefix?: string;
  suffix?: string;
  color: string;
  icon: React.ElementType;
}

// ── Billing ─────────────────────────────────────────
export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
}

// ── Notifications ────────────────────────────────────
export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
}

// ── Documents ───────────────────────────────────────
export type DocType = 'pdf' | 'doc' | 'xls' | 'ppt' | 'zip';

export interface Document {
  id: string;
  name: string;
  type: DocType;
  size: string;
  clientName?: string;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
}

// ── Homepage ─────────────────────────────────────────
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  metric: string;
  avatar: string;
  color: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number | 'Custom';
  annualPrice: number | 'Custom';
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
  color: string;
}
