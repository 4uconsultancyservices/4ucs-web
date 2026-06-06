import { Role } from '@prisma/client';

// ── Permission Matrix ──────────────────────────────────────
export const PERMISSIONS = {
  // CRM
  'crm:leads:read':   [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES],
  'crm:leads:create': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES],
  'crm:leads:update': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES],
  'crm:leads:delete': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],

  // Sales / Deals
  'sales:deals:read':   [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES],
  'sales:deals:create': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES],
  'sales:deals:update': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES],
  'sales:deals:delete': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],

  // Marketing
  'marketing:campaigns:read':   [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.MARKETING],
  'marketing:campaigns:create': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.MARKETING],
  'marketing:campaigns:update': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.MARKETING],
  'marketing:campaigns:delete': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],

  // Clients
  'client:clients:read':   [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES],
  'client:clients:create': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  'client:clients:update': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  'client:clients:delete': [Role.SUPER_ADMIN, Role.ADMIN],

  // Projects
  'client:projects:read':   [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES, Role.CLIENT],
  'client:projects:create': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  'client:projects:update': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  'client:projects:delete': [Role.SUPER_ADMIN, Role.ADMIN],

  // Tickets
  'client:tickets:read':   [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES, Role.CLIENT],
  'client:tickets:create': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES, Role.CLIENT],
  'client:tickets:update': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES],
  'client:tickets:delete': [Role.SUPER_ADMIN, Role.ADMIN],

  // Documents
  'client:documents:read':   [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES, Role.CLIENT],
  'client:documents:create': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES],
  'client:documents:delete': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],

  // Billing
  'billing:invoices:read':   [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.CLIENT],
  'billing:invoices:create': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  'billing:invoices:update': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  'billing:invoices:delete': [Role.SUPER_ADMIN, Role.ADMIN],
  'billing:subscriptions:read':   [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.CLIENT],
  'billing:subscriptions:update': [Role.SUPER_ADMIN, Role.ADMIN],

  // Analytics
  'analytics:read': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER],
  'analytics:export': [Role.SUPER_ADMIN, Role.ADMIN],

  // Users
  'users:read':   [Role.SUPER_ADMIN, Role.ADMIN],
  'users:create': [Role.SUPER_ADMIN, Role.ADMIN],
  'users:update': [Role.SUPER_ADMIN, Role.ADMIN],
  'users:delete': [Role.SUPER_ADMIN],

  // Notifications
  'notifications:read':   [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES, Role.MARKETING, Role.CLIENT],
  'notifications:update': [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.SALES, Role.MARKETING, Role.CLIENT],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: Permission): boolean {
  const allowed = PERMISSIONS[permission] as readonly Role[];
  return allowed.includes(role);
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new PermissionError(`Role '${role}' does not have permission: '${permission}'`);
  }
}

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

// Role hierarchy - higher index = more access
export const ROLE_HIERARCHY: Role[] = [
  Role.CLIENT,
  Role.SALES,
  Role.MARKETING,
  Role.MANAGER,
  Role.ADMIN,
  Role.SUPER_ADMIN,
];

export function isRoleAtLeast(userRole: Role, minRole: Role): boolean {
  return ROLE_HIERARCHY.indexOf(userRole) >= ROLE_HIERARCHY.indexOf(minRole);
}
