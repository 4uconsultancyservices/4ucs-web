'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FolderOpen, Ticket, CreditCard, Activity, ArrowUpRight, CheckCircle, Clock, AlertCircle, ChevronRight, Download } from 'lucide-react';
import { projects, tickets, invoices } from '@/lib/data';
import { StatusDot, PriorityBadge } from '@/components/dashboard/widgets/StatusHelpers';

const usageData = [
  { week: 'W1', hours: 8 }, { week: 'W2', hours: 12 }, { week: 'W3', hours: 9 },
  { week: 'W4', hours: 15 }, { week: 'W5', hours: 11 }, { week: 'W6', hours: 18 },
  { week: 'W7', hours: 14 }, { week: 'W8', hours: 22 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 text-xs border border-white/[0.1]">
      <div className="text-white/40">{label}</div>
      <div className="text-white font-semibold mt-0.5">{payload[0].value}h used</div>
    </div>
  );
};

// Simulated client's projects & tickets
const myProjects = projects.filter(p => ['c1', 'c3'].includes(p.clientId)).slice(0, 4);
const myTickets = tickets.filter(t => ['c1', 'c3'].includes(t.clientId)).slice(0, 3);
const myInvoices = invoices.slice(0, 3);

export default function PortalPage() {
  return (
    <div className="space-y-5">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden border border-white/[0.07] p-6"
        style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.08) 0%, rgba(124,58,237,0.05) 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-full opacity-10"
          style={{ background: 'radial-gradient(circle at 80% 50%, #0066ff, transparent 60%)' }} />
        <div className="relative">
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">Enterprise Plan</div>
          <h2 className="font-display text-2xl font-bold text-white mb-1">Welcome back, Acme Corp 👋</h2>
          <p className="text-sm text-white/50">Your plan renews on <span className="text-white/80">June 30, 2026</span> · 22/40 advisory hours used this month</p>
        </div>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: myProjects.filter(p => p.status === 'active').length, icon: FolderOpen, color: '#0066ff', href: '/portal/projects' },
          { label: 'Open Tickets', value: myTickets.filter(t => t.status === 'open').length, icon: Ticket, color: '#f59e0b', href: '/portal/support' },
          { label: 'Hours Used', value: '22/40', icon: Activity, color: '#7c3aed', href: '/portal/reports' },
          { label: 'Next Invoice', value: '$8,500', icon: CreditCard, color: '#10b981', href: '/portal/billing' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Link href={s.href} className="dash-card flex items-center gap-4 group cursor-pointer block hover:border-white/[0.14] transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}28` }}>
                  <Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/40 truncate">{s.label}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Usage + Plan */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 dash-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Advisory Hours (8-Week Trend)</div>
              <div className="font-display text-xl font-bold text-white">22 / 40 <span className="text-sm font-normal text-white/40">hrs this month</span></div>
            </div>
            <Link href="/portal/reports" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Full report <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="hours" stroke="#7c3aed" strokeWidth={2} fill="url(#hoursGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="dash-card">
          <div className="text-sm font-display font-semibold text-white mb-4">Plan Usage</div>
          {[
            { label: 'Advisory Hours', used: 22, total: 40, color: '#7c3aed' },
            { label: 'Active Projects', used: 2, total: 10, color: '#0066ff' },
            { label: 'Team Seats', used: 5, total: 20, color: '#22d3ee' },
            { label: 'Storage (GB)', used: 12, total: 50, color: '#10b981' },
          ].map(({ label, used, total, color }) => (
            <div key={label} className="mb-3.5 last:mb-0">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/55">{label}</span>
                <span className="text-white font-mono font-semibold">{used}/{total}</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(used / total) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                  className="h-full rounded-full" style={{ background: color }} />
              </div>
            </div>
          ))}
          <button className="btn-ghost w-full py-2.5 text-xs mt-4">Upgrade Plan</button>
        </motion.div>
      </div>

      {/* Projects + Tickets + Invoices */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Projects */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="dash-card overflow-hidden p-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="font-display font-semibold text-white text-sm">Projects</div>
            <Link href="/portal/projects" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></Link>
          </div>
          <div className="p-3 space-y-2">
            {myProjects.map((p, i) => {
              const clr: Record<string, string> = { active: '#0066ff', complete: '#10b981', upcoming: '#7c3aed', 'on-hold': '#f59e0b' };
              const c = clr[p.status] ?? '#6b7280';
              return (
                <div key={p.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/80 truncate">{p.name}</span>
                    <StatusDot status={p.status} />
                  </div>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 + i * 0.05 }}
                      className="h-full rounded-full" style={{ background: c }} />
                  </div>
                  <div className="text-xs text-white/30 mt-1.5">{p.progress}% · Due {new Date(p.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Tickets */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="dash-card overflow-hidden p-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="font-display font-semibold text-white text-sm">Recent Tickets</div>
            <Link href="/portal/support" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></Link>
          </div>
          <div className="p-3 space-y-2">
            {myTickets.map((t) => (
              <div key={t.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-sm font-medium text-white/80 leading-snug truncate">{t.title}</span>
                  <PriorityBadge priority={t.priority} />
                </div>
                <div className="flex items-center justify-between text-xs text-white/30">
                  <span className="font-mono">{t.id}</span>
                  <StatusDot status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Invoices */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="dash-card overflow-hidden p-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="font-display font-semibold text-white text-sm">Invoices</div>
            <Link href="/portal/billing" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></Link>
          </div>
          <div className="p-3 space-y-2">
            {myInvoices.map((inv) => {
              const c = { paid: '#10b981', pending: '#f59e0b', overdue: '#ef4444', draft: '#6b7280' }[inv.status] ?? '#6b7280';
              return (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                  <div>
                    <div className="text-xs font-mono text-white/40">{inv.id}</div>
                    <div className="font-display font-bold text-white">${inv.amount.toLocaleString()}</div>
                    <div className="text-xs text-white/30">{new Date(inv.issuedAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded capitalize"
                      style={{ background: `${c}18`, color: c, border: `1px solid ${c}28` }}>{inv.status}</span>
                    <button className="text-white/25 hover:text-white/60 transition-colors"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
