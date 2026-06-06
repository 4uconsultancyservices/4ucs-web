'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CreditCard, Plus, RefreshCw, Shield } from 'lucide-react';
import { invoices } from '@/lib/data';

export default function PortalBillingPage() {
  const [tab, setTab] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const filtered = tab === 'all' ? invoices : invoices.filter(i => i.status === tab);
  const total = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);

  const statusColor = (s: string) => ({ paid: '#10b981', pending: '#f59e0b', overdue: '#ef4444', draft: '#6b7280' })[s] ?? '#6b7280';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Plan + payment */}
      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="dash-card">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Current Plan</div>
          <div className="font-display text-2xl font-bold text-white mb-1">Enterprise</div>
          <div className="text-sm text-white/50 mb-4">$8,500 / month · Renews Jun 30, 2026</div>
          <div className="flex gap-2">
            <button className="btn-primary py-2 px-4 text-xs">Upgrade Plan</button>
            <button className="btn-ghost py-2 px-4 text-xs">Manage Subscription</button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="dash-card">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Payment Method</div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600/10 to-violet-600/10 border border-white/[0.07] mb-4">
            <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-700 flex items-center justify-center"><CreditCard className="w-4 h-4 text-white/60" /></div>
            <div>
              <div className="text-sm font-medium text-white">Visa ending 4242</div>
              <div className="text-xs text-white/35">Expires 09/28</div>
            </div>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-emerald-500/12 text-emerald-400 border border-emerald-500/20 font-bold">Default</span>
          </div>
          <button className="btn-ghost py-2 px-4 text-xs gap-2 w-full justify-center"><Plus className="w-3.5 h-3.5" />Add Payment Method</button>
        </motion.div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Paid (All Time)', value: `$${(total / 1000).toFixed(0)}K`, color: '#10b981' },
          { label: 'Pending', value: `$${(pending / 1000).toFixed(0)}K`, color: '#f59e0b' },
          { label: 'Next Due', value: '$8,500', color: '#0066ff' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 + i * 0.06 }}
            className="dash-card text-center py-4">
            <div className="font-display text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Invoice table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="dash-card overflow-hidden p-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="font-display font-semibold text-white text-sm">Invoice History</div>
          <div className="flex gap-1">
            {(['all', 'paid', 'pending', 'overdue'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${tab === t ? 'bg-blue-500/20 text-blue-300 border border-blue-500/25' : 'text-white/40 hover:text-white/70'}`}>{t}</button>
            ))}
          </div>
        </div>
        <table className="data-table">
          <thead><tr>{['Invoice','Amount','Issued','Due','Status',''].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((inv, i) => {
              const c = statusColor(inv.status);
              return (
                <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td className="font-mono text-xs text-white/40">{inv.id}</td>
                  <td className="font-display font-bold text-white">${inv.amount.toLocaleString()}</td>
                  <td className="text-white/40 text-xs">{new Date(inv.issuedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                  <td className="text-white/40 text-xs">{new Date(inv.dueAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                  <td>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded capitalize"
                      style={{ background: `${c}15`, color: c, border: `1px solid ${c}25` }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />{inv.status}
                    </span>
                  </td>
                  <td><button className="text-white/25 hover:text-white/60 transition-colors"><Download className="w-4 h-4" /></button></td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
