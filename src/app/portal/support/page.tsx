'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MessageSquare, Clock, CheckCircle, AlertCircle, X, Send } from 'lucide-react';
import { tickets } from '@/lib/data';
import { StatusDot, PriorityBadge } from '@/components/dashboard/widgets/StatusHelpers';

const myTickets = tickets.slice(0, 6);

export default function PortalSupportPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState('');

  const filtered = myTickets.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const detail = myTickets.find(t => t.id === selected);

  const summary = {
    open: myTickets.filter(t => t.status === 'open').length,
    inProgress: myTickets.filter(t => t.status === 'in-progress').length,
    resolved: myTickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open', value: summary.open, icon: AlertCircle, color: '#f59e0b' },
          { label: 'In Progress', value: summary.inProgress, icon: Clock, color: '#0066ff' },
          { label: 'Resolved', value: summary.resolved, icon: CheckCircle, color: '#10b981' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="dash-card flex items-center gap-4 py-4">
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

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets…"
            className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none flex-1" />
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary py-2 px-4 gap-2 text-xs">
          <Plus className="w-3.5 h-3.5" /> New Ticket
        </button>
      </div>

      {/* Tickets + Detail */}
      <div className="flex gap-4">
        <div className={`space-y-2 transition-all duration-300 ${selected ? 'flex-1' : 'w-full'}`}>
          {filtered.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(t.id === selected ? null : t.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${selected === t.id ? 'border-blue-500/30 bg-blue-500/05' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]'}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white/85 text-sm truncate">{t.title}</div>
                  <div className="text-xs text-white/35 mt-0.5 truncate">{t.description.slice(0, 80)}…</div>
                </div>
                <PriorityBadge priority={t.priority} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-white/30">
                  <span className="font-mono">{t.id}</span>
                  <span>Assignee: {t.assignee.split(' ')[0]}</span>
                </div>
                <StatusDot status={t.status} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && detail && (
            <motion.div initial={{ opacity: 0, x: 20, width: 0 }} animate={{ opacity: 1, x: 0, width: 340 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="flex-shrink-0 dash-card flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-white/40">{detail.id}</span>
                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <h3 className="font-display font-semibold text-white mb-2 leading-snug">{detail.title}</h3>
              <p className="text-sm text-white/50 mb-4 leading-relaxed">{detail.description}</p>
              <div className="space-y-2 mb-4">
                {[
                  { l: 'Priority', v: detail.priority },
                  { l: 'Status', v: detail.status },
                  { l: 'Assignee', v: detail.assignee },
                  { l: 'Updated', v: new Date(detail.updatedAt).toLocaleDateString('en-US') },
                ].map(({ l, v }) => (
                  <div key={l} className="flex justify-between text-xs">
                    <span className="text-white/30 uppercase tracking-wider">{l}</span>
                    <span className="text-white/65 font-medium capitalize">{v.replace(/-/g, ' ')}</span>
                  </div>
                ))}
              </div>
              {/* Reply */}
              <div className="mt-auto pt-4 border-t border-white/[0.06]">
                <div className="text-xs text-white/35 mb-2">Add reply</div>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
                  placeholder="Type your message…"
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500/40 resize-none transition-all" />
                <button className="btn-primary w-full py-2.5 text-xs mt-2 gap-2">
                  <Send className="w-3.5 h-3.5" /> Send Reply
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New ticket modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={() => setShowNew(false)}>
            <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.97, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg glass-card rounded-2xl border border-white/[0.12] p-6 space-y-4 shadow-enterprise">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-white">Open New Ticket</h3>
                <button onClick={() => setShowNew(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              {[
                { label: 'Title', type: 'text', placeholder: 'Brief summary of the issue' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500/50 transition-all" />
                </div>
              ))}
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Priority</label>
                <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none cursor-pointer">
                  {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p} className="bg-[#060d1f]">{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea rows={4} placeholder="Describe the issue in detail…"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500/50 resize-none transition-all" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowNew(false)} className="btn-ghost flex-1 py-2.5 text-xs">Cancel</button>
                <button onClick={() => setShowNew(false)} className="btn-primary flex-1 py-2.5 text-xs">Submit Ticket</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
