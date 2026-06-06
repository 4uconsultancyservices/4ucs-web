# 4UCS Platform — Full-Stack Enterprise SaaS

> **Launch in Days. Scale Globally.**
> Production-ready Next.js 15 + Prisma + JWT RBAC + live-data dashboards.

## Quick Start

\`\`\`bash
npm install
cp .env.example .env.local   # set DATABASE_URL + JWT_SECRET
npm run db:generate
npm run db:push
npm run db:seed
npm run dev                  # → localhost:3000/login
\`\`\`

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@4ucs.com | Admin@4UCS2026! |
| Sales | sales@4ucs.com | Sales@4UCS2026! |
| Marketing | marketing@4ucs.com | Mktg@4UCS2026! |
| Client | client@acmecorp.com | Client@4UCS2026! |

## Stack

Next.js 15 · TypeScript · PostgreSQL · Prisma 5 · JWT (jose) · bcryptjs · Zod · Tailwind CSS · Framer Motion · Three.js · Recharts

## API Modules

| Module | Base Path | Methods |
|--------|-----------|---------|
| Auth | `/api/auth/*` | POST |
| CRM/Leads | `/api/crm/leads` | GET POST PATCH DELETE |
| Activities | `/api/crm/activities` | GET POST |
| Deals | `/api/sales/deals` | GET POST PATCH DELETE |
| Pipeline | `/api/sales/pipeline` | GET |
| Campaigns | `/api/marketing/campaigns` | GET POST PATCH DELETE |
| Segments | `/api/marketing/segments` | GET POST |
| Clients | `/api/client/clients` | GET POST PATCH DELETE |
| Projects | `/api/client/projects` | GET POST PATCH DELETE |
| Tickets | `/api/client/tickets` | GET POST PATCH DELETE |
| Documents | `/api/client/documents` | GET POST |
| Invoices | `/api/billing/invoices` | GET POST PATCH DELETE |
| Subscriptions | `/api/billing/subscriptions` | GET POST |
| Analytics | `/api/analytics/*` | GET |

## Commands

\`\`\`bash
npm run dev           # Turbopack dev server
npm run build         # Production build
npm run test          # Jest test suite
npm run db:seed       # Seed demo data
npm run db:studio     # Prisma Studio
\`\`\`

## RBAC Roles
SUPER_ADMIN · ADMIN · MANAGER · SALES · MARKETING · CLIENT

Each API route enforces permissions at the service layer via JWT session + role matrix.
