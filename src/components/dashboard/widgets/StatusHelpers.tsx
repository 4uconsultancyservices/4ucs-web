import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  active: '#10b981', onboarding: '#0066ff', 'at-risk': '#f59e0b',
  churned: '#ef4444', prospect: '#7c3aed',
  complete: '#10b981', upcoming: '#a78bfa', 'on-hold': '#f59e0b', cancelled: '#ef4444',
  open: '#f59e0b', 'in-progress': '#0066ff', resolved: '#10b981', closed: '#ffffff40', waiting: '#a78bfa',
  paid: '#10b981', pending: '#f59e0b', overdue: '#ef4444', draft: '#6b7280',
  critical: '#ef4444', high: '#f59e0b', medium: '#0066ff', low: '#6b7280',
};

export function StatusDot({ status }: { status: string }) {
  const color = statusColors[status] ?? '#6b7280';
  return (
    <span className="flex items-center gap-1.5 text-xs capitalize whitespace-nowrap" style={{ color }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      {status.replace(/-/g, ' ')}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const color = statusColors[priority] ?? '#6b7280';
  return (
    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {priority}
    </span>
  );
}

export function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    Growth: '#0066ff', Enterprise: '#7c3aed', Global: '#22d3ee',
  };
  const color = colors[plan] ?? '#6b7280';
  return (
    <span className="inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap"
      style={{ background: `${color}18`, color, border: `1px solid ${color}28` }}>
      {plan}
    </span>
  );
}

export function DocTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    pdf: '#ef4444', doc: '#0066ff', xls: '#10b981', ppt: '#f59e0b', zip: '#7c3aed',
  };
  const color = colors[type] ?? '#6b7280';
  return (
    <span className="inline-flex items-center justify-center w-10 h-7 text-[10px] font-bold uppercase rounded"
      style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
      {type}
    </span>
  );
}
