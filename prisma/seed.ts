import { PrismaClient, Role, LeadStatus, DealStage, ClientStatus, SubscriptionPlan, SubscriptionStatus, TicketPriority, TicketStatus, InvoiceStatus, CampaignStatus, CampaignType, ProjectStatus, ActivityType } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const superAdmin = await prisma.user.upsert({ where:{ email:'super@4ucs.com' }, update:{}, create:{
    email:'super@4ucs.com', name:'Super Admin', password: await bcrypt.hash('Admin@4UCS2026!',12), role:Role.SUPER_ADMIN,
  }});
  const adminUser = await prisma.user.upsert({ where:{ email:'admin@4ucs.com' }, update:{}, create:{
    email:'admin@4ucs.com', name:'Admin User', password: await bcrypt.hash('Admin@4UCS2026!',12), role:Role.ADMIN,
  }});
  const salesUser = await prisma.user.upsert({ where:{ email:'sales@4ucs.com' }, update:{}, create:{
    email:'sales@4ucs.com', name:'Alex Martinez', password: await bcrypt.hash('Sales@4UCS2026!',12), role:Role.SALES,
  }});
  const marketingUser = await prisma.user.upsert({ where:{ email:'marketing@4ucs.com' }, update:{}, create:{
    email:'marketing@4ucs.com', name:'Sarah Kim', password: await bcrypt.hash('Mktg@4UCS2026!',12), role:Role.MARKETING,
  }});

  const client1 = await prisma.client.upsert({ where:{ id:'client-globalpay' }, update:{}, create:{
    id:'client-globalpay', name:'GlobalPay Inc.', industry:'Fintech', country:'USA', status:ClientStatus.ACTIVE, plan:SubscriptionPlan.ENTERPRISE, mrr:8500,
  }});
  const client2 = await prisma.client.upsert({ where:{ id:'client-retailflow' }, update:{}, create:{
    id:'client-retailflow', name:'RetailFlow', industry:'E-commerce', country:'Singapore', status:ClientStatus.ACTIVE, plan:SubscriptionPlan.GLOBAL, mrr:18000,
  }});
  const client3 = await prisma.client.upsert({ where:{ id:'client-novatech' }, update:{}, create:{
    id:'client-novatech', name:'NovaTech Systems', industry:'SaaS', country:'Canada', status:ClientStatus.ACTIVE, plan:SubscriptionPlan.GROWTH, mrr:2500,
  }});

  const portalUser = await prisma.user.upsert({ where:{ email:'client@acmecorp.com' }, update:{}, create:{
    email:'client@acmecorp.com', name:'Alice Ford', password: await bcrypt.hash('Client@4UCS2026!',12), role:Role.CLIENT,
  }});
  await prisma.clientUser.upsert({ where:{ userId:portalUser.id }, update:{}, create:{ userId:portalUser.id, clientId:client1.id, role:'admin' }});

  const lead1 = await prisma.lead.create({ data:{
    firstName:'John', lastName:'Carter', email:'john@zenithcorp.io', company:'Zenith Corp', industry:'Technology',
    source:'website', status:LeadStatus.QUALIFIED, score:82, estimatedValue:85000, assignedToId:salesUser.id, createdById:salesUser.id,
  }});
  await prisma.lead.create({ data:{
    firstName:'Maria', lastName:'Santos', email:'maria@bluestar.com', company:'BlueStar Tech', industry:'Healthcare',
    source:'referral', status:LeadStatus.PROPOSAL, score:74, estimatedValue:42000, assignedToId:salesUser.id, createdById:adminUser.id,
  }});
  await prisma.lead.create({ data:{
    firstName:'Tom', lastName:'Nakamura', email:'tom@momentumai.jp', company:'Momentum AI', industry:'AI/ML',
    source:'social', status:LeadStatus.NEW, score:45, estimatedValue:95000, assignedToId:salesUser.id, createdById:salesUser.id,
  }});

  await prisma.deal.create({ data:{ title:'Zenith Corp — Enterprise Cloud Migration', value:85000, stage:DealStage.NEGOTIATION, probability:80, expectedClose:new Date('2026-06-01'), assignedToId:salesUser.id, clientId:client1.id }});
  await prisma.deal.create({ data:{ title:'BlueStar Tech — Analytics Platform', value:42000, stage:DealStage.PROPOSAL, probability:60, expectedClose:new Date('2026-06-15'), assignedToId:salesUser.id }});
  await prisma.deal.create({ data:{ title:'RetailFlow — Global Expansion', value:220000, stage:DealStage.WON, probability:100, expectedClose:new Date('2026-04-01'), closedAt:new Date('2026-04-01'), assignedToId:salesUser.id, clientId:client2.id }});

  await prisma.activity.create({ data:{ type:ActivityType.CALL, title:'Discovery call with John Carter', description:'Cloud migration requirements. Strong Enterprise interest.', outcome:'Positive — sent proposal', completedAt:new Date(), duration:45, userId:salesUser.id, leadId:lead1.id }});

  await prisma.project.create({ data:{ name:'Cloud Migration Phase 2', description:'Migrate remaining microservices to AWS EKS', status:ProjectStatus.ACTIVE, progress:78, budget:120000, spent:94000, startDate:new Date('2026-02-01'), dueDate:new Date('2026-06-30'), clientId:client1.id, tags:['AWS','Migration','DevOps'] }});
  await prisma.project.create({ data:{ name:'Analytics Dashboard Build', description:'Real-time BI platform with custom KPI dashboards', status:ProjectStatus.ACTIVE, progress:45, budget:85000, spent:38000, startDate:new Date('2026-03-15'), dueDate:new Date('2026-07-15'), clientId:client2.id, tags:['BI','Recharts','Data'] }});

  await prisma.ticket.create({ data:{ ticketNumber:'TKT-2041', title:'API rate limiting configuration', description:'Production API returning 429s under load.', priority:TicketPriority.CRITICAL, status:TicketStatus.OPEN, clientId:client1.id, assignedToId:salesUser.id, createdById:adminUser.id, tags:['API','Production'] }});
  await prisma.ticket.create({ data:{ ticketNumber:'TKT-2040', title:'Dashboard CSV export broken', description:'Export fails silently on datasets over 10k rows.', priority:TicketPriority.HIGH, status:TicketStatus.IN_PROGRESS, clientId:client2.id, assignedToId:adminUser.id, createdById:adminUser.id, tags:['Bug','Dashboard'] }});

  const sub1 = await prisma.subscription.create({ data:{ clientId:client1.id, plan:SubscriptionPlan.ENTERPRISE, status:SubscriptionStatus.ACTIVE, mrr:8500, currentPeriodStart:new Date('2026-05-01'), currentPeriodEnd:new Date('2026-06-01') }});
  await prisma.subscription.create({ data:{ clientId:client2.id, plan:SubscriptionPlan.GLOBAL, status:SubscriptionStatus.ACTIVE, mrr:18000, currentPeriodStart:new Date('2026-05-01'), currentPeriodEnd:new Date('2026-06-01') }});

  await prisma.invoice.create({ data:{ invoiceNumber:'INV-2026-051', clientId:client1.id, subscriptionId:sub1.id, status:InvoiceStatus.PAID, amount:8500, tax:0, total:8500, dueDate:new Date('2026-05-15'), paidAt:new Date('2026-05-03'), lineItems:[{ description:'Enterprise Plan — May 2026', qty:1, unitPrice:8500, amount:8500 }] }});
  await prisma.invoice.create({ data:{ invoiceNumber:'INV-2026-050', clientId:client2.id, status:InvoiceStatus.SENT, amount:18000, tax:0, total:18000, dueDate:new Date('2026-05-20'), lineItems:[{ description:'Global Plan — May 2026', qty:1, unitPrice:18000, amount:18000 }] }});

  await prisma.campaign.create({ data:{ name:'Q2 Enterprise Outreach', type:CampaignType.EMAIL, status:CampaignStatus.ACTIVE, subject:'Scale your SaaS in 90 days — 4UCS', createdById:marketingUser.id, budget:5000, spent:2100, impressions:45000, clicks:2800, conversions:34, opens:8900 }});
  await prisma.campaign.create({ data:{ name:'Fintech Leaders Webinar', type:CampaignType.WEBINAR, status:CampaignStatus.SCHEDULED, scheduledAt:new Date('2026-06-15'), createdById:marketingUser.id, budget:3000 }});

  const months = ['2026-01-01','2026-02-01','2026-03-01','2026-04-01','2026-05-01'];
  const mrrVals = [210000,245000,280000,320000,460000];
  for (let i=0; i<months.length; i++) {
    await prisma.analyticsSnapshot.upsert({ where:{ date_metric:{ date:new Date(months[i]), metric:'mrr' } }, update:{}, create:{ date:new Date(months[i]), metric:'mrr', value:mrrVals[i] } });
  }

  await prisma.notification.create({ data:{ userId:adminUser.id, type:'success', title:'Deployment successful', description:'RetailFlow production v2.3.1 deployed with zero downtime.' }});
  await prisma.notification.create({ data:{ userId:adminUser.id, type:'error', title:'Critical ticket opened', description:'TKT-2041: API rate limiting at GlobalPay Inc.' }});

  console.log('✅ Seed complete!');
  console.log('  Super Admin : super@4ucs.com   / Admin@4UCS2026!');
  console.log('  Admin       : admin@4ucs.com   / Admin@4UCS2026!');
  console.log('  Sales       : sales@4ucs.com   / Sales@4UCS2026!');
  console.log('  Marketing   : marketing@4ucs.com / Mktg@4UCS2026!');
  console.log('  Client      : client@acmecorp.com / Client@4UCS2026!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
