'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Download, TrendingUp, Clock, CheckCircle, BarChart3 } from 'lucide-react';

const usageData = [
  { month: 'Nov', hours: 28, projects: 2 }, { month: 'Dec', hours: 32, projects: 2 },
  { month: 'Jan', hours: 24, projects: 3 }, { month: 'Feb', hours: 36, projects: 3 },
  { month: 'Mar', hours: 38, projects: 4 }, { month: 'Apr', hours: 40, projects: 4 },
  { month: 'May', hours: 22, projects: 4 },
];

const ticketData = [
  { month: 'Nov', open: 3, resolved: 5 }, { month: 'Dec', open: 2, resolved: 4 },
  { month: 'Jan', open: 4, resolved: 6 }, { month: 'Feb', open: 1, resolved: 5 },
  { month: 'Mar', open: 3, resolved: 7 }, { month: 'Apr', open: 2, resolved: 4 },
  { month: 'May', open: 2, resolved: 1 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-3 text-xs border border-white/[0.1] space-y-1">
      <div className="text-white/40 mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex gap-2"><span className="text-white/50 capitalize">{p.name}:</span><span className="text-white font-semibold">{p.value}</span></div>
      ))}
    </div>
  );
};

const reports = [
  { name: 'Q1 2026 Advisory Report', date: 'Apr 1, 2026', pages: 12 },
  { name: 'Q4 2025 Advisory Report', date: 'Jan 1, 2026', pages: 14 },
  { name: 'Cloud Migration ROI Analysis', date: 'Mar 15, 2026', pages: 8 },
  { name: 'Security Posture Review', date: 'Feb 28, 2026', pages: 20 },
];

export default function PortalReportsPage() {
  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Hours Used (YTD)', value: '220h', icon: Clock, color: '#7c3aed' },
          { label: 'Projects Completed', value: '2', icon: CheckCircle, color: '#10b981' },
          { label: 'Avg. Resolution Time', value: '18h', icon: TrendingUp, color: '#0066ff' },
          { label: 'CSAT Score', value: '98%', icon: BarChart3, color: '#f59e0b' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="dash-card flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, border: `1px solid ${s.color}28` }}>
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="dash-card">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Advisory Hours Used</div>
          <div className="font-display text-xl font-bold text-white mb-4">40h/mo Plan</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="portalHoursG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="hours" stroke="#7c3aed" strokeWidth={2} fill="url(#portalHoursG)" dot={false} name="Hours" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="dash-card">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Ticket Volume</div>
          <div className="font-display text-xl font-bold text-white mb-4">Open vs Resolved</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ticketData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="open" fill="#f59e0b" radius={[3,3,0,0]} opacity={0.8} name="Open" />
              <Bar dataKey="resolved" fill="#10b981" radius={[3,3,0,0]} opacity={0.8} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Downloadable reports */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="dash-card">
        <div className="font-display font-semibold text-white text-sm mb-4">Downloadable Reports</div>
        <div className="space-y-2">
          {reports.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 + i * 0.06 }}
              className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] transition-all group cursor-pointer">
              <div>
                <div className="font-medium text-white/80 text-sm">{r.name}</div>
                <div className="text-xs text-white/35 mt-0.5">{r.pages} pages · {r.date}</div>
              </div>
              <button className="flex items-center gap-2 btn-ghost py-2 px-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
