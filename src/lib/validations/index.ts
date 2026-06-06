import { z } from 'zod';

// ── Shared ────────────────────────────────────────────────
export const PaginationSchema = z.object({
  page:    z.coerce.number().int().min(1).default(1),
  limit:   z.coerce.number().int().min(1).max(100).default(20),
  search:  z.string().optional(),
  sortBy:  z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});
export type PaginationInput = z.infer<typeof PaginationSchema>;

// ── Auth ─────────────────────────────────────────────────
export const LoginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters').max(100),
  email:    z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  role:     z.enum(['SUPER_ADMIN','ADMIN','MANAGER','SALES','MARKETING','CLIENT']).optional(),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

// ── CRM / Leads ───────────────────────────────────────────
export const CreateLeadSchema = z.object({
  firstName:      z.string().min(1).max(100),
  lastName:       z.string().min(1).max(100),
  email:          z.string().email(),
  phone:          z.string().optional(),
  company:        z.string().max(200).optional(),
  industry:       z.string().max(100).optional(),
  website:        z.string().url().optional().or(z.literal('')),
  country:        z.string().max(100).optional(),
  source:         z.enum(['website','referral','social','event','cold','partner','other']).optional(),
  status:         z.enum(['NEW','CONTACTED','QUALIFIED','PROPOSAL','NEGOTIATION','WON','LOST','ARCHIVED']).default('NEW'),
  score:          z.number().int().min(0).max(100).default(0),
  estimatedValue: z.number().min(0).optional(),
  assignedToId:   z.string().cuid().optional(),
  notes:          z.string().max(2000).optional(),
});
export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;

export const UpdateLeadSchema = CreateLeadSchema.partial();
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;

export const LeadFilterSchema = PaginationSchema.extend({
  status:      z.enum(['NEW','CONTACTED','QUALIFIED','PROPOSAL','NEGOTIATION','WON','LOST','ARCHIVED']).optional(),
  source:      z.string().optional(),
  assignedToId:z.string().optional(),
  minScore:    z.coerce.number().optional(),
  maxScore:    z.coerce.number().optional(),
});
export type LeadFilterInput = z.infer<typeof LeadFilterSchema>;

// ── Activities ────────────────────────────────────────────
export const CreateActivitySchema = z.object({
  type:        z.enum(['CALL','EMAIL','MEETING','NOTE','TASK','FOLLOW_UP','DEMO','PROPOSAL_SENT']),
  title:       z.string().min(1).max(300),
  description: z.string().max(2000).optional(),
  outcome:     z.string().max(500).optional(),
  dueAt:       z.string().datetime().optional(),
  duration:    z.number().int().min(1).optional(),
  leadId:      z.string().cuid().optional(),
  dealId:      z.string().cuid().optional(),
  ticketId:    z.string().cuid().optional(),
  clientId:    z.string().cuid().optional(),
});
export type CreateActivityInput = z.infer<typeof CreateActivitySchema>;

// ── Sales / Deals ─────────────────────────────────────────
export const CreateDealSchema = z.object({
  title:         z.string().min(1).max(300),
  value:         z.number().min(0),
  currency:      z.string().length(3).default('USD'),
  stage:         z.enum(['PROSPECT','QUALIFIED','PROPOSAL','NEGOTIATION','WON','LOST']).default('PROSPECT'),
  probability:   z.number().int().min(0).max(100).default(20),
  expectedClose: z.string().datetime().optional(),
  assignedToId:  z.string().cuid().optional(),
  clientId:      z.string().cuid().optional(),
  notes:         z.string().max(2000).optional(),
  lostReason:    z.string().max(500).optional(),
});
export type CreateDealInput = z.infer<typeof CreateDealSchema>;

export const UpdateDealSchema = CreateDealSchema.partial();
export type UpdateDealInput = z.infer<typeof UpdateDealSchema>;

export const UpdateDealStageSchema = z.object({
  stage:       z.enum(['PROSPECT','QUALIFIED','PROPOSAL','NEGOTIATION','WON','LOST']),
  probability: z.number().int().min(0).max(100).optional(),
  lostReason:  z.string().max(500).optional(),
});
export type UpdateDealStageInput = z.infer<typeof UpdateDealStageSchema>;

// ── Marketing / Campaigns ─────────────────────────────────
export const CreateCampaignSchema = z.object({
  name:        z.string().min(1).max(300),
  type:        z.enum(['EMAIL','SMS','SOCIAL','CONTENT','WEBINAR','EVENT']),
  status:      z.enum(['DRAFT','SCHEDULED','ACTIVE','PAUSED','COMPLETED','CANCELLED']).default('DRAFT'),
  subject:     z.string().max(500).optional(),
  body:        z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  segmentId:   z.string().cuid().optional(),
  budget:      z.number().min(0).optional(),
});
export type CreateCampaignInput = z.infer<typeof CreateCampaignSchema>;

export const UpdateCampaignSchema = CreateCampaignSchema.partial();
export type UpdateCampaignInput = z.infer<typeof UpdateCampaignSchema>;

export const CreateSegmentSchema = z.object({
  name:        z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  filters:     z.record(z.array(z.string())),
});
export type CreateSegmentInput = z.infer<typeof CreateSegmentSchema>;

// ── Client Management ─────────────────────────────────────
export const CreateClientSchema = z.object({
  name:     z.string().min(1).max(200),
  industry: z.string().max(100).optional(),
  website:  z.string().url().optional().or(z.literal('')),
  country:  z.string().max(100).optional(),
  phone:    z.string().max(30).optional(),
  address:  z.string().max(500).optional(),
  plan:     z.enum(['GROWTH','ENTERPRISE','GLOBAL']).default('GROWTH'),
  notes:    z.string().max(2000).optional(),
});
export type CreateClientInput = z.infer<typeof CreateClientSchema>;

export const UpdateClientSchema = CreateClientSchema.partial().extend({
  status: z.enum(['PROSPECT','ONBOARDING','ACTIVE','AT_RISK','CHURNED','SUSPENDED']).optional(),
});
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;

// ── Projects ──────────────────────────────────────────────
export const CreateProjectSchema = z.object({
  name:        z.string().min(1).max(300),
  description: z.string().max(2000).optional(),
  clientId:    z.string().cuid(),
  budget:      z.number().min(0).optional(),
  startDate:   z.string().datetime().optional(),
  dueDate:     z.string().datetime().optional(),
  tags:        z.array(z.string()).default([]),
  leadId:      z.string().optional(),
});
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  status:   z.enum(['PLANNING','ACTIVE','ON_HOLD','COMPLETE','CANCELLED']).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  spent:    z.number().min(0).optional(),
});
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

// ── Tickets ───────────────────────────────────────────────
export const CreateTicketSchema = z.object({
  title:       z.string().min(1).max(300),
  description: z.string().min(1).max(5000),
  priority:    z.enum(['LOW','MEDIUM','HIGH','CRITICAL']).default('MEDIUM'),
  clientId:    z.string().cuid(),
  tags:        z.array(z.string()).default([]),
});
export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;

export const UpdateTicketSchema = z.object({
  title:       z.string().min(1).max(300).optional(),
  description: z.string().max(5000).optional(),
  priority:    z.enum(['LOW','MEDIUM','HIGH','CRITICAL']).optional(),
  status:      z.enum(['OPEN','IN_PROGRESS','WAITING','RESOLVED','CLOSED']).optional(),
  assignedToId:z.string().cuid().optional().nullable(),
  tags:        z.array(z.string()).optional(),
});
export type UpdateTicketInput = z.infer<typeof UpdateTicketSchema>;

export const CreateTicketCommentSchema = z.object({
  body:       z.string().min(1).max(5000),
  isInternal: z.boolean().default(false),
});
export type CreateTicketCommentInput = z.infer<typeof CreateTicketCommentSchema>;

// ── Billing ───────────────────────────────────────────────
export const CreateInvoiceSchema = z.object({
  clientId:      z.string().cuid(),
  subscriptionId:z.string().cuid().optional(),
  amount:        z.number().min(0),
  tax:           z.number().min(0).default(0),
  currency:      z.string().length(3).default('USD'),
  dueDate:       z.string().datetime(),
  notes:         z.string().max(500).optional(),
  lineItems:     z.array(z.object({
    description: z.string(),
    qty:         z.number().int().min(1),
    unitPrice:   z.number().min(0),
    amount:      z.number().min(0),
  })),
});
export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;

export const UpdateInvoiceSchema = z.object({
  status:  z.enum(['DRAFT','SENT','PAID','OVERDUE','CANCELLED','REFUNDED']).optional(),
  dueDate: z.string().datetime().optional(),
  notes:   z.string().max(500).optional(),
  paidAt:  z.string().datetime().optional(),
});
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceSchema>;

export const CreateSubscriptionSchema = z.object({
  clientId:           z.string().cuid(),
  plan:               z.enum(['GROWTH','ENTERPRISE','GLOBAL']),
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd:   z.string().datetime(),
  trialEnds:          z.string().datetime().optional(),
});
export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
