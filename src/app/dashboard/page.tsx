'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, Users, TrendingUp, Ticket, AlertCircle, ArrowUpRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { analyticsApi, clientsApi, ticketsApi } from '@/lib/api-client';
import { SkeletonCard, SkeletonTable, ErrorState, PageLoader } from '@/components/ui/states';
import { StatusDot, PlanBadge } from '@/components/dashboard/widgets/StatusHelpers';
import { formatRelative } from '@/lib/utils';

const ChartTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-3 text-xs border border-white/[0.1]">
      <div className="text-white font-semibold">${(payload[0].value / 1000).toFixed(0)}K MRR</div>
    </div>
  );
};

export default function DashboardPage() {
  const { data: summary, loading, error, refetch } = useApi(
    () => analyticsApi.dashboard() as any, [],
  );
  const { data: revenue,     loading: loadingRev     } = useApi(() => analyticsApi.revenue('year') as any, []);
  const { data: clientsData, loading: loadingClients } = useApi(() => clientsApi.list({ limit: 6 }) as any, []);
  const { data: ticketsData, loading: loadingTickets } = useApi(() => ticketsApi.list({ limit: 5 }) as any, []);

  if (loading) return <PageLoader message="Loading command center…" />;
  if (error)   return <ErrorState message={error} onRetry={refetch} />;

  const s = summary as any ?? {};
  const revenueSnaps = (revenue as any)?.snapshots ?? [];

  const stats = [
    { label: 'Monthly Recurring Revenue', value: `$${((s.mrr ?? 0) / 1000).toFixed(0)}K`, change: 21.3, color: '#0066ff', icon: DollarSign },
    { label: 'Active Clients',            value: s.activeClients  ?? 0,  change: 8.5,   color: '#7c3aed', icon: Users },
    { label: 'Won Revenue (Month)',        value: `$${((s.wonRevenueMonth ?? 0) / 1000).toFixed(0)}K`, change: 12.1, color: '#22d3ee', icon: TrendingUp },
    { label: 'Open Tickets',              value: s.openTickets    ?? 0,  change: -18.2, color: s.criticalTickets > 0 ? '#ef4444' : '#10b981', icon: s.criticalTickets > 0 ? AlertCircle : Ticket },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="dash-card relative overflow-hidden group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}28` }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${stat.change >= 0 ? 'bg-emerald-500/12 text-emerald-400' : 'bg-red-500/12 text-red-400'}`}>
                  {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                </span>
              </div>
              <div className="font-display text-2xl font-bold text-white mb-1">{String(stat.value)}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue chart + platform health */}
      <div className="grid xl:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="xl:col-span-2 dash-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">MRR Trend</div>
              <div className="font-display text-xl font-bold text-white">${((s.mrr ?? 0) / 1000).toFixed(0)}K <span className="text-sm font-normal text-emerald-400">↑ 21.3%</span></div>
            </div>
            <Link href="/dashboard/analytics" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">Full report <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          {loadingRev ? (
            <div className="h-[200px] skeleton rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueSnaps}>
                <defs>
                  <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0066ff" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0066ff" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleString('en-US', { month: 'short' })}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#0066ff" strokeWidth={2} fill="url(#dashGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="dash-card space-y-3">
          <div className="font-display font-semibold text-white text-sm mb-2">Platform Health</div>
          {[
            { label: 'Total Clients',      value: s.totalClients    ?? '—' },
            { label: 'Active Clients',     value: s.activeClients   ?? '—' },
            { label: 'New Leads (Month)',  value: s.newLeads        ?? '—' },
            { label: 'ARR',                value: `$${((s.arr ?? 0) / 1_000_000).toFixed(2)}M` },
            { label: 'Overdue Invoices',   value: s.overdueInvoices ?? '—' },
            { label: 'Critical Tickets',   value: s.criticalTickets ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-sm py-1 border-b border-white/[0.04] last:border-0">
              <span className="text-white/45">{label}</span>
              <span className="font-semibold text-white">{String(value)}</span>
            </div>
          ))}
          <Link href="/dashboard/analytics" className="btn-ghost w-full py-2.5 text-xs justify-center mt-2">
            Full Analytics →
          </Link>
        </motion.div>
      </div>

      {/* Recent clients */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="dash-card overflow-hidden p-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="font-display font-semibold text-white text-sm">Recent Clients</div>
          <Link href="/dashboard/clients" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></Link>
        </div>
        {loadingClients ? <SkeletonTable rows={5} /> : (
          <table className="data-table">
            <thead><tr>{['Client','Industry','Plan','MRR','Status'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {((clientsData as any) ?? []).map((c: any, i: number) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/50 to-violet-600/50 flex items-center justify-center text-[10px] font-bold text-white">{c.name.slice(0,2).toUpperCase()}</div>
                      <span className="font-medium text-white/80">{c.name}</span>
                    </div>
                  </td>
                  <td className="text-white/45">{c.industry ?? '—'}</td>
                  <td><PlanBadge plan={c.plan} /></td>
                  <td className="font-mono font-semibold text-white/80">${c.mrr?.toLocaleString()}</td>
                  <td><StatusDot status={c.status.toLowerCase()} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Recent tickets */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="dash-card overflow-hidden p-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="font-display font-semibold text-white text-sm">Recent Tickets</div>
          <Link href="/dashboard/tickets" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">All tickets <ArrowUpRight className="w-3 h-3" /></Link>
        </div>
        {loadingTickets ? <SkeletonTable rows={4} /> : (
          <table className="data-table">
            <thead><tr>{['ID','Title','Client','Priority','Status','Updated'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {((ticketsData as any) ?? []).map((t: any, i: number) => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td className="font-mono text-xs text-white/40">{t.ticketNumber}</td>
                  <td className="text-white/75 max-w-[200px] truncate">{t.title}</td>
                  <td className="text-white/45">{t.client?.name}</td>
                  <td><span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ background: t.priority === 'CRITICAL' ? 'rgba(239,68,68,0.12)' : t.priority === 'HIGH' ? 'rgba(245,158,11,0.12)' : 'rgba(0,102,255,0.12)', color: t.priority === 'CRITICAL' ? '#ef4444' : t.priority === 'HIGH' ? '#f59e0b' : '#60b0ff' }}>{t.priority}</span></td>
                  <td><StatusDot status={t.status.toLowerCase().replace('_','-')} /></td>
                  <td className="text-white/30 text-xs">{formatRelative(t.updatedAt)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Live activity */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="dash-card">
        <div className="flex items-center justify-between mb-4">
          <div className="font-display font-semibold text-white text-sm">Live Activity</div>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live</span>
        </div>
        {(s.recentActivities ?? []).length === 0 ? (
          <p className="text-sm text-white/30 text-center py-6">No recent activity</p>
        ) : (
          (s.recentActivities ?? []).map((a: any) => (
            <div key={a.id} className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white/75">{a.title}</div>
                <div className="text-xs text-white/35 mt-0.5">{a.user?.name}</div>
              </div>
              <div className="text-[10px] text-white/25 whitespace-nowrap">{formatRelative(a.createdAt)}</div>
            </div>
          ))
        )}
        <Link href="/dashboard/activity" className="mt-3 text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300">View activity log <ArrowUpRight className="w-3 h-3" /></Link>
      </motion.div>
    </div>
  );
}
