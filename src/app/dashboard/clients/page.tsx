'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Download, MoreHorizontal, Mail, Globe, X, Loader2 } from 'lucide-react';
import { useApi, useMutation, usePaginatedApi } from '@/hooks/useApi';
import { clientsApi } from '@/lib/api-client';
import { SkeletonTable, ErrorState, EmptyState, Pagination } from '@/components/ui/states';
import { StatusDot, PlanBadge } from '@/components/dashboard/widgets/StatusHelpers';
import { useDebounce } from '@/hooks/index';

export default function ClientsPage() {
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter,   setPlanFilter]   = useState('');
  const [showDetail,   setShowDetail]   = useState<any | null>(null);
  const [showCreate,   setShowCreate]   = useState(false);
  const [form,         setForm]         = useState({ name:'', industry:'', country:'', plan:'GROWTH', website:'', phone:'' });

  const debouncedSearch = useDebounce(search, 400);

  const { items, total, page, totalPages, loading, error, setPage, refetch } = usePaginatedApi(
    (p) => clientsApi.list({ page: p, limit: 15, search: debouncedSearch || undefined, status: statusFilter || undefined, plan: planFilter || undefined }) as any,
    [debouncedSearch, statusFilter, planFilter],
  );

  const { mutate: createClient, loading: creating } = useMutation(
    (body) => clientsApi.create(body) as any,
    { onSuccess: () => { setShowCreate(false); setForm({ name:'', industry:'', country:'', plan:'GROWTH', website:'', phone:'' }); refetch(); } },
  );

  const { mutate: deleteClient } = useMutation(
    (id) => clientsApi.remove(id as string) as any,
    { onSuccess: () => { setShowDetail(null); refetch(); } },
  );

  const totalMRR   = items.reduce((s: number, c: any) => s + (c.mrr ?? 0), 0);
  const activeCount = items.filter((c: any) => c.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Showing', value: total,      color: '#0066ff' },
          { label: 'Active',  value: activeCount, color: '#10b981' },
          { label: 'MRR',     value: `$${(totalMRR/1000).toFixed(0)}K`, color: '#7c3aed' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}
            className="dash-card text-center py-4">
            <div className="font-display text-2xl font-bold mb-1" style={{ color: s.color }}>{String(s.value)}</div>
            <div className="text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…"
            className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none flex-1" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-white/60 outline-none cursor-pointer">
          <option value="">All Statuses</option>
          {['ACTIVE','ONBOARDING','AT_RISK','CHURNED','PROSPECT','SUSPENDED'].map(s => (
            <option key={s} value={s} className="bg-[#060d1f] capitalize">{s.replace('_',' ')}</option>
          ))}
        </select>
        <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
          className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-sm text-white/60 outline-none cursor-pointer">
          <option value="">All Plans</option>
          {['GROWTH','ENTERPRISE','GLOBAL'].map(p => <option key={p} value={p} className="bg-[#060d1f]">{p}</option>)}
        </select>
        <button className="btn-ghost py-2 px-4 gap-2 text-xs"><Download className="w-3.5 h-3.5" />Export</button>
        <button onClick={() => setShowCreate(true)} className="btn-primary py-2 px-4 gap-2 text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Client
        </button>
      </div>

      {/* Table */}
      <div className="flex gap-4">
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          className={`dash-card overflow-hidden p-0 transition-all duration-300 ${showDetail ? 'flex-1' : 'w-full'}`}>
          {error ? (
            <div className="p-8"><ErrorState message={error} onRetry={refetch} /></div>
          ) : loading ? (
            <SkeletonTable rows={8} />
          ) : items.length === 0 ? (
            <div className="p-8"><EmptyState title="No clients found" description="Try adjusting your filters or add a new client." action={{ label: '+ Add Client', onClick: () => setShowCreate(true) }} /></div>
          ) : (
            <>
              <table className="data-table">
                <thead><tr>{['Client','Industry','Plan','MRR','Country','Status','Projects',''].map(h => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {items.map((c: any, i: number) => (
                    <motion.tr key={c.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.03 }}
                      onClick={() => setShowDetail(c)} className="cursor-pointer">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/50 to-violet-600/50 flex items-center justify-center text-xs font-bold text-white">
                            {c.name.slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white/85 text-sm">{c.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-white/45 text-sm">{c.industry ?? '—'}</td>
                      <td><PlanBadge plan={c.plan} /></td>
                      <td className="font-mono font-semibold text-white/80">${c.mrr?.toLocaleString()}</td>
                      <td className="text-white/45 text-sm">{c.country ?? '—'}</td>
                      <td><StatusDot status={c.status?.toLowerCase()} /></td>
                      <td className="text-white/40 font-mono text-xs">{c._count?.projects ?? 0}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className="text-white/20 hover:text-white/60 transition-colors p-1 rounded">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
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

        {/* Slide-over detail */}
        <AnimatePresence>
          {showDetail && (
            <motion.div initial={{ opacity:0, x:20, width:0 }} animate={{ opacity:1, x:0, width:300 }} exit={{ opacity:0, x:20, width:0 }}
              className="flex-shrink-0 dash-card flex flex-col gap-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-white">Client Details</h2>
                <button onClick={() => setShowDetail(null)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-lg font-bold text-white">
                  {showDetail.name.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div className="font-display text-lg font-bold text-white">{showDetail.name}</div>
                  <div className="text-xs text-white/40">{showDetail.industry ?? 'Unknown industry'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { l:'Plan',     v: showDetail.plan },
                  { l:'MRR',      v: `$${showDetail.mrr?.toLocaleString()}` },
                  { l:'Status',   v: showDetail.status?.replace('_',' ') },
                  { l:'Country',  v: showDetail.country ?? '—' },
                  { l:'Projects', v: showDetail._count?.projects ?? 0 },
                  { l:'Tickets',  v: showDetail._count?.tickets  ?? 0 },
                ].map(({ l, v }) => (
                  <div key={l} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <div className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">{l}</div>
                    <div className="text-sm font-semibold text-white capitalize">{String(v)}</div>
                  </div>
                ))}
              </div>
              {showDetail.website && (
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <a href={showDetail.website} target="_blank" rel="noopener noreferrer" className="hover:text-white truncate">{showDetail.website}</a>
                </div>
              )}
              <div className="mt-auto pt-4 border-t border-white/[0.06] flex flex-col gap-2">
                <button className="btn-primary py-2.5 text-xs justify-center">Edit Client</button>
                <button onClick={() => deleteClient(showDetail.id)} className="btn-danger py-2.5 text-xs justify-center">Delete Client</button>
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
                <h3 className="font-display font-bold text-white">New Client</h3>
                <button onClick={() => setShowCreate(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {([
                  { label:'Company Name *', key:'name',     type:'text',  placeholder:'Acme Corp'          },
                  { label:'Industry',       key:'industry', type:'text',  placeholder:'Fintech'            },
                  { label:'Country',        key:'country',  type:'text',  placeholder:'USA'                },
                  { label:'Phone',          key:'phone',    type:'text',  placeholder:'+1 555 000 0000'    },
                  { label:'Website',        key:'website',  type:'url',   placeholder:'https://acme.com'  },
                ] as { label: string; key: keyof typeof form; type: string; placeholder: string }[]).map(f => (
                  <div key={f.key} className={f.key === 'website' ? 'sm:col-span-2' : ''}>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                    <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Plan</label>
                  <select value={form.plan} onChange={e => setForm(prev => ({ ...prev, plan: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none cursor-pointer">
                    {['GROWTH','ENTERPRISE','GLOBAL'].map(p => <option key={p} value={p} className="bg-[#060d1f]">{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-ghost flex-1 py-2.5 text-xs">Cancel</button>
                <button disabled={creating || !form.name} onClick={() => createClient(form)}
                  className="btn-primary flex-1 py-2.5 text-xs gap-2 disabled:opacity-50">
                  {creating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating…</> : 'Create Client'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
