'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Send, Loader2, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useMutation, usePaginatedApi } from '@/hooks/useApi';
import { ticketsApi } from '@/lib/api-client';
import { SkeletonTable, ErrorState, EmptyState, Pagination } from '@/components/ui/states';
import { StatusDot, PriorityBadge } from '@/components/dashboard/widgets/StatusHelpers';
import { useDebounce } from '@/hooks/index';
import { formatRelative } from '@/lib/utils';

export default function TicketsPage() {
  const [search,     setSearch]     = useState('');
  const [priority,   setPriority]   = useState('');
  const [status,     setStatus]     = useState('');
  const [selected,   setSelected]   = useState<any | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [comment,    setComment]    = useState('');
  const [form,       setForm]       = useState({ title:'', description:'', priority:'MEDIUM', clientId:'' });

  const debouncedSearch = useDebounce(search, 400);

  const { items, total, page, totalPages, loading, error, setPage, refetch } = usePaginatedApi(
    (p) => ticketsApi.list({ page: p, limit: 15, search: debouncedSearch || undefined, priority: priority || undefined, status: status || undefined }) as any,
    [debouncedSearch, priority, status],
  );

  const { mutate: addComment, loading: commenting } = useMutation(
    (body) => ticketsApi.addComment(selected?.id, body as any) as any,
    { onSuccess: () => { setComment(''); refetch(); } },
  );

  const { mutate: updateStatus } = useMutation(
    (body) => ticketsApi.update(selected?.id, body) as any,
    { onSuccess: () => refetch() },
  );

  const { mutate: createTicket, loading: creating } = useMutation(
    (body) => ticketsApi.create(body) as any,
    { onSuccess: () => { setShowCreate(false); setForm({ title:'', description:'', priority:'MEDIUM', clientId:'' }); refetch(); } },
  );

  const summary = {
    open:       items.filter((t: any) => t.status === 'OPEN').length,
    inProgress: items.filter((t: any) => t.status === 'IN_PROGRESS').length,
    resolved:   items.filter((t: any) => t.status === 'RESOLVED').length,
    critical:   items.filter((t: any) => t.priority === 'CRITICAL').length,
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Open',       value: summary.open,       icon: AlertCircle, color:'#f59e0b' },
          { label:'In Progress',value: summary.inProgress, icon: Clock,       color:'#0066ff' },
          { label:'Resolved',   value: summary.resolved,   icon: CheckCircle, color:'#10b981' },
          { label:'Critical',   value: summary.critical,   icon: AlertCircle, color:'#ef4444' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}
            className="dash-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:`${color}18`, border:`1px solid ${color}28` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-white/40">{label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets, IDs…"
            className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none flex-1" />
        </div>
        <select value={priority} onChange={e => setPriority(e.target.value)}
          className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-white/60 outline-none cursor-pointer">
          <option value="">All Priorities</option>
          {['CRITICAL','HIGH','MEDIUM','LOW'].map(p => <option key={p} value={p} className="bg-[#060d1f] capitalize">{p.toLowerCase()}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-white/60 outline-none cursor-pointer">
          <option value="">All Statuses</option>
          {['OPEN','IN_PROGRESS','WAITING','RESOLVED','CLOSED'].map(s => <option key={s} value={s} className="bg-[#060d1f]">{s.replace('_',' ')}</option>)}
        </select>
        <button onClick={() => setShowCreate(true)} className="btn-primary py-2 px-4 gap-2 text-xs">
          <Plus className="w-3.5 h-3.5" /> New Ticket
        </button>
      </div>

      {/* Table + detail */}
      <div className="flex gap-4">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
          className={`dash-card overflow-hidden p-0 transition-all duration-300 ${selected ? 'flex-1' : 'w-full'}`}>
          {error ? (
            <div className="p-8"><ErrorState message={error} onRetry={refetch} /></div>
          ) : loading ? (
            <SkeletonTable rows={8} />
          ) : items.length === 0 ? (
            <div className="p-8"><EmptyState title="No tickets found" description="All clear! No tickets match your filters." /></div>
          ) : (
            <>
              <table className="data-table">
                <thead><tr>{['ID','Title','Client','Priority','Status','Assignee','Updated',''].map(h => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {items.map((t: any, i: number) => (
                    <motion.tr key={t.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.03 }}
                      onClick={() => setSelected(selected?.id === t.id ? null : t)}
                      className={`cursor-pointer ${selected?.id === t.id ? 'bg-blue-500/06' : ''}`}>
                      <td className="font-mono text-xs text-white/40">{t.ticketNumber}</td>
                      <td className="max-w-[180px]">
                        <div className="text-sm font-medium text-white/85 truncate">{t.title}</div>
                        <div className="text-xs text-white/30 truncate">{t.description?.slice(0,60)}…</div>
                      </td>
                      <td className="text-white/45 text-sm whitespace-nowrap">{t.client?.name}</td>
                      <td><PriorityBadge priority={t.priority?.toLowerCase()} /></td>
                      <td><StatusDot status={t.status?.toLowerCase().replace('_','-')} /></td>
                      <td className="text-white/40 text-sm">{t.assignedTo?.name ?? '—'}</td>
                      <td className="text-white/30 text-xs whitespace-nowrap">{formatRelative(t.updatedAt)}</td>
                      <td />
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3">
                <Pagination page={page} totalPages={totalPages} total={total} limit={15} onPageChange={setPage} />
              </div>
            </>
          )}
        </motion.div>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity:0, x:20, width:0 }} animate={{ opacity:1, x:0, width:320 }} exit={{ opacity:0, x:20, width:0 }}
              className="flex-shrink-0 dash-card flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-white/40">{selected.ticketNumber}</span>
                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div>
                <h3 className="font-display font-semibold text-white leading-snug mb-2">{selected.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{selected.description}</p>
              </div>
              <div className="space-y-2">
                {[
                  { l:'Priority', v: selected.priority },
                  { l:'Status',   v: selected.status?.replace('_',' ') },
                  { l:'Client',   v: selected.client?.name },
                  { l:'Assignee', v: selected.assignedTo?.name ?? 'Unassigned' },
                  { l:'Updated',  v: formatRelative(selected.updatedAt) },
                ].map(({ l, v }) => (
                  <div key={l} className="flex justify-between text-xs py-1 border-b border-white/[0.04] last:border-0">
                    <span className="text-white/35 uppercase tracking-wider">{l}</span>
                    <span className="text-white/70 font-medium capitalize">{String(v)}</span>
                  </div>
                ))}
              </div>
              {/* Quick status actions */}
              <div className="flex flex-wrap gap-1.5">
                {['IN_PROGRESS','RESOLVED','CLOSED'].map(s => (
                  <button key={s} onClick={() => updateStatus({ status: s })}
                    className="text-[10px] font-bold uppercase px-2 py-1 rounded border border-white/[0.08] text-white/40 hover:text-white hover:border-white/[0.2] transition-all">
                    → {s.replace('_',' ')}
                  </button>
                ))}
              </div>
              {/* Reply */}
              <div className="mt-auto pt-4 border-t border-white/[0.06]">
                <div className="text-xs text-white/35 mb-2">Add Reply</div>
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                  placeholder="Type your message…"
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/40 resize-none transition-all" />
                <button disabled={!comment.trim() || commenting} onClick={() => addComment({ body: comment })}
                  className="btn-primary w-full py-2.5 text-xs mt-2 gap-2 disabled:opacity-50">
                  {commenting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Send Reply
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={() => setShowCreate(false)}>
            <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm" />
            <motion.div initial={{ scale:0.97, y:10 }} animate={{ scale:1, y:0 }} exit={{ scale:0.97, y:10 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg glass-card rounded-2xl border border-white/[0.12] p-6 space-y-4 shadow-enterprise">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-white">New Support Ticket</h3>
                <button onClick={() => setShowCreate(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Brief description of the issue"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Client ID *</label>
                <input value={form.clientId} onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))}
                  placeholder="Client CUID (e.g. client-globalpay)"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Priority</label>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none cursor-pointer">
                  {['LOW','MEDIUM','HIGH','CRITICAL'].map(p => <option key={p} value={p} className="bg-[#060d1f]">{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Description *</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={4} placeholder="Detailed description of the issue…"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 resize-none transition-all" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-ghost flex-1 py-2.5 text-xs">Cancel</button>
                <button disabled={creating || !form.title || !form.description || !form.clientId} onClick={() => createTicket(form)}
                  className="btn-primary flex-1 py-2.5 text-xs gap-2 disabled:opacity-50">
                  {creating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating…</> : 'Submit Ticket'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
