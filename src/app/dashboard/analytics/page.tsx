'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { analyticsApi } from '@/lib/api-client';
import { SkeletonCard, ErrorState, PageLoader } from '@/components/ui/states';

const PERIODS = ['month', 'quarter', 'year'] as const;
type Period = typeof PERIODS[number];

const TT = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color?: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-3 text-xs border border-white/[0.1]">
      <div className="text-white/40 mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color ?? '#0066ff' }} />
          <span className="text-white/55">{p.name}:</span>
          <span className="text-white font-semibold">{typeof p.value === 'number' && p.value > 1000 ? `$${(p.value / 1000).toFixed(0)}K` : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const GEO = [
  { region: 'North America', pct: 42, color: '#0066ff' },
  { region: 'Europe',        pct: 28, color: '#7c3aed' },
  { region: 'Asia Pacific',  pct: 20, color: '#22d3ee' },
  { region: 'Rest of World', pct: 10, color: '#f59e0b' },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('year');

  const { data: rv, loading: rLoading, error: rError, refetch } = useApi(() => analyticsApi.revenue(period) as any, [period]);
  const { data: sv, loading: sLoading }                         = useApi(() => analyticsApi.sales()           as any, []);
  const { data: mv, loading: mLoading }                         = useApi(() => analyticsApi.marketing()       as any, []);

  if (rLoading && sLoading) return <PageLoader message="Loading analytics…" />;
  if (rError)               return <ErrorState message={rError} onRetry={refetch} />;

  const revenue   = (rv as any) ?? {};
  const sales     = (sv as any) ?? {};
  const marketing = (mv as any) ?? {};
  const snaps     = revenue.snapshots ?? [];

  const kpis = [
    { label: 'MRR',          value: `$${((revenue.mrr ?? 0) / 1000).toFixed(0)}K`,              change:  21.3, color: '#0066ff', icon: DollarSign  },
    { label: 'ARR',          value: `$${((revenue.arr ?? 0) / 1_000_000).toFixed(2)}M`,          change:  21.3, color: '#7c3aed', icon: TrendingUp  },
    { label: 'Active Subs',  value: revenue.activeSubscriptions ?? 0,                             change:   8.5, color: '#22d3ee', icon: Users       },
    { label: 'Churn Rate',   value: `${revenue.churnRate ?? 0}%`,                                 change: -12.4, color: '#10b981', icon: TrendingDown },
  ];

  const stageColors: Record<string, string> = {
    PROSPECT: '#60b0ff', QUALIFIED: '#0066ff', PROPOSAL: '#7c3aed', NEGOTIATION: '#22d3ee', WON: '#10b981', LOST: '#ef4444',
  };

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        {PERIODS.map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${p === period ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'}`}>
            {p}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {rLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : kpis.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="dash-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}18`, border: `1px solid ${kpi.color}28` }}>
                      <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${kpi.change >= 0 ? 'bg-emerald-500/12 text-emerald-400' : 'bg-red-500/12 text-red-400'}`}>
                      {kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change)}%
                    </span>
                  </div>
                  <div className="font-display text-2xl font-bold text-white mb-1">{String(kpi.value)}</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">{kpi.label}</div>
                </motion.div>
              );
            })}
      </div>

      {/* MRR chart + geo */}
      <div className="grid xl:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="xl:col-span-2 dash-card">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">MRR Over Time</div>
          <div className="font-display text-xl font-bold text-white mb-4">${((revenue.mrr ?? 0) / 1000).toFixed(0)}K <span className="text-sm font-normal text-emerald-400">↑ 21.3%</span></div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={snaps}>
              <defs>
                <linearGradient id="anlG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0066ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0066ff" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleString('en-US', { month: 'short' })}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="value" stroke="#0066ff" strokeWidth={2} fill="url(#anlG)" dot={false} name="MRR ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="dash-card">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Revenue by Region</div>
          <div className="font-display text-lg font-bold text-white mb-4">Geographic Split</div>
          <div className="flex justify-center mb-4">
            <PieChart width={170} height={145}>
              <Pie data={GEO} dataKey="pct" cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={3}>
                {GEO.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-1.5">
            {GEO.map(d => (
              <div key={d.region} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                <span className="text-white/55 flex-1">{d.region}</span>
                <span className="text-white font-bold">{d.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Deal stages + Lead sources */}
      <div className="grid xl:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="dash-card">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Pipeline</div>
          <div className="font-display font-semibold text-white mb-4">Deals by Stage</div>
          <div className="space-y-3">
            {(sales.dealsByStage ?? []).map((d: any) => {
              const max   = Math.max(...(sales.dealsByStage ?? []).map((x: any) => x._count._all), 1);
              const pct   = (d._count._all / max) * 100;
              const color = stageColors[d.stage] ?? '#6b7280';
              return (
                <div key={d.stage}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/55 capitalize">{d.stage.toLowerCase()}</span>
                    <span className="text-white font-semibold">{d._count._all} · ${((d._sum?.value ?? 0) / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                      className="h-full rounded-full" style={{ background: color }} />
                  </div>
                </div>
              );
            })}
            {!(sales.dealsByStage?.length) && <p className="text-white/30 text-sm text-center py-4">No deal data</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="dash-card">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Lead Acquisition</div>
          <div className="font-display font-semibold text-white mb-4">Sources Breakdown</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sales.leadsBySource ?? []} layout="vertical" barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="source" type="category" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={72} />
              <Tooltip contentStyle={{ background: '#060d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="_count._all" fill="#7c3aed" radius={[0, 4, 4, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
          {!(sales.leadsBySource?.length) && <p className="text-white/30 text-sm text-center py-4">No lead source data</p>}
        </motion.div>
      </div>

      {/* Top Campaigns */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="dash-card overflow-hidden p-0">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <div className="font-display font-semibold text-white text-sm">Top Campaign Performance</div>
        </div>
        <table className="data-table">
          <thead><tr>{['Campaign', 'Type', 'Conversions', 'Clicks', 'Opens', 'Spent'].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {(marketing.topCampaigns ?? []).map((c: any, i: number) => (
              <tr key={c.id}>
                <td className="font-medium text-white/80">{c.name}</td>
                <td><span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/12 text-blue-300 border border-blue-500/20">{c.type}</span></td>
                <td className="font-mono text-emerald-400 font-semibold">{c.conversions}</td>
                <td className="font-mono text-white/60">{c.clicks?.toLocaleString()}</td>
                <td className="font-mono text-white/60">{c.opens?.toLocaleString()}</td>
                <td className="font-mono text-white/60">${c.spent?.toLocaleString()}</td>
              </tr>
            ))}
            {!(marketing.topCampaigns?.length) && (
              <tr><td colSpan={6} className="py-10 text-center text-white/30 text-sm">No campaign data yet</td></tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
