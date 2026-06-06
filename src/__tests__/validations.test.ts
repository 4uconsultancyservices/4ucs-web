import {
  LoginSchema, CreateLeadSchema, CreateDealSchema, CreateCampaignSchema,
  CreateClientSchema, CreateTicketSchema, CreateInvoiceSchema, PaginationSchema,
} from '@/lib/validations';

describe('LoginSchema', () => {
  it('accepts valid creds', () => expect(LoginSchema.safeParse({ email:'a@b.com', password:'Pass1234' }).success).toBe(true));
  it('rejects bad email',   () => expect(LoginSchema.safeParse({ email:'bad', password:'Pass1234' }).success).toBe(false));
  it('rejects short pass',  () => expect(LoginSchema.safeParse({ email:'a@b.com', password:'short' }).success).toBe(false));
});

describe('CreateLeadSchema', () => {
  const v = { firstName:'John', lastName:'Doe', email:'j@c.com' };
  it('accepts minimal',         () => expect(CreateLeadSchema.safeParse(v).success).toBe(true));
  it('rejects bad email',       () => expect(CreateLeadSchema.safeParse({...v,email:'bad'}).success).toBe(false));
  it('rejects score > 100',     () => expect(CreateLeadSchema.safeParse({...v,score:101}).success).toBe(false));
  it('rejects negative value',  () => expect(CreateLeadSchema.safeParse({...v,estimatedValue:-1}).success).toBe(false));
  it('defaults status to NEW',  () => { const r = CreateLeadSchema.safeParse(v); expect(r.success && (r.data as any).status).toBe('NEW'); });
});

describe('CreateDealSchema', () => {
  const v = { title:'Big Deal', value:50000 };
  it('accepts valid',           () => expect(CreateDealSchema.safeParse(v).success).toBe(true));
  it('rejects negative value',  () => expect(CreateDealSchema.safeParse({...v,value:-1}).success).toBe(false));
  it('rejects prob > 100',      () => expect(CreateDealSchema.safeParse({...v,probability:101}).success).toBe(false));
  it('defaults stage PROSPECT', () => { const r = CreateDealSchema.safeParse(v); expect(r.success && (r.data as any).stage).toBe('PROSPECT'); });
  it('defaults currency USD',   () => { const r = CreateDealSchema.safeParse(v); expect(r.success && (r.data as any).currency).toBe('USD'); });
});

describe('CreateCampaignSchema', () => {
  const v = { name:'Q2', type:'EMAIL' };
  it('accepts valid',          () => expect(CreateCampaignSchema.safeParse(v).success).toBe(true));
  it('rejects invalid type',   () => expect(CreateCampaignSchema.safeParse({...v,type:'INVALID'}).success).toBe(false));
  it('defaults status DRAFT',  () => { const r = CreateCampaignSchema.safeParse(v); expect(r.success && (r.data as any).status).toBe('DRAFT'); });
});

describe('CreateClientSchema', () => {
  it('accepts minimal',       () => expect(CreateClientSchema.safeParse({ name:'Corp' }).success).toBe(true));
  it('rejects empty name',    () => expect(CreateClientSchema.safeParse({ name:'' }).success).toBe(false));
  it('rejects invalid plan',  () => expect(CreateClientSchema.safeParse({ name:'Corp', plan:'PREMIUM' }).success).toBe(false));
  it('defaults plan GROWTH',  () => { const r = CreateClientSchema.safeParse({ name:'Corp' }); expect(r.success && (r.data as any).plan).toBe('GROWTH'); });
});

describe('CreateTicketSchema', () => {
  const v = { title:'Issue', description:'Full description here', clientId:'clxxxxxxxxxxxxxxxxxxxxxxxxx' };
  it('accepts valid',               () => expect(CreateTicketSchema.safeParse(v).success).toBe(true));
  it('rejects empty title',         () => expect(CreateTicketSchema.safeParse({...v,title:''}).success).toBe(false));
  it('rejects invalid priority',    () => expect(CreateTicketSchema.safeParse({...v,priority:'URGENT'}).success).toBe(false));
  it('defaults priority MEDIUM',    () => { const r = CreateTicketSchema.safeParse(v); expect(r.success && (r.data as any).priority).toBe('MEDIUM'); });
});

describe('CreateInvoiceSchema', () => {
  const v = { clientId:'clxxxxxxxxxxxxxxxxxxxxxxxxx', amount:8500, tax:0, currency:'USD',
    dueDate:new Date(Date.now()+86400000).toISOString(), lineItems:[{ description:'Service', qty:1, unitPrice:8500, amount:8500 }] };
  it('accepts valid',         () => expect(CreateInvoiceSchema.safeParse(v).success).toBe(true));
  it('rejects negative amt',  () => expect(CreateInvoiceSchema.safeParse({...v,amount:-1}).success).toBe(false));
  it('rejects empty items',   () => expect(CreateInvoiceSchema.safeParse({...v,lineItems:[]}).success).toBe(false));
});

describe('PaginationSchema', () => {
  it('defaults page=1 limit=20', () => { const r = PaginationSchema.parse({}); expect(r.page).toBe(1); expect(r.limit).toBe(20); });
  it('coerces strings',          () => { const r = PaginationSchema.parse({ page:'2', limit:'50' }); expect(r.page).toBe(2); expect(r.limit).toBe(50); });
  it('rejects limit > 100',      () => expect(PaginationSchema.safeParse({ limit:101 }).success).toBe(false));
  it('rejects page < 1',         () => expect(PaginationSchema.safeParse({ page:0 }).success).toBe(false));
});
