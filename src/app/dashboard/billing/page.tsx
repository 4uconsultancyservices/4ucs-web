'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Plus, X, Loader2, DollarSign, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { useApi, useMutation, usePaginatedApi } from '@/hooks/useApi';
import { invoicesApi, subscriptionsApi } from '@/lib/api-client';
import { SkeletonCard, SkeletonTable, ErrorState, EmptyState, Pagination } from '@/components/ui/states';
import { formatRelative } from '@/lib/utils';

const statusColor = (s: string) =>
  ({ PAID:'#10b981', SENT:'#f59e0b', OVERDUE:'#ef4444', DRAFT:'#6b7280', CANCELLED:'#9ca3af', REFUNDED:'#a78bfa' }[s] ?? '#6b7280');

export default function BillingPage() {
  const [tab,        setTab]        = useState<'all'|'PAID'|'SENT'|'OVERDUE'|'DRAFT'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ clientId:'', amount:'', tax:'0', currency:'USD', dueDate:'', notes:'' });

  const { data: summary, loading: sumLoading, error: sumError, refetch: sumRefetch } = useApi(
    () => invoicesApi.summary() as any, [],
  );

  const { items, total, page, totalPages, loading, error, setPage, refetch } = usePaginatedApi(
    (p) => invoicesApi.list({ page: p, limit: 15, status: tab === 'all' ? undefined : tab }) as any,
    [tab],
  );

  const { mutate: markPaid, loading: paying } = useMutation(
    (id) => invoicesApi.markPaid(id as string) as any,
    { onSuccess: () => { refetch(); sumRefetch(); } },
  );

  const { mutate: createInvoice, loading: creating } = useMutation(
    (body) => invoicesApi.create(body) as any,
    { onSuccess: () => { setShowCreate(false); setForm({ clientId:'', amount:'', tax:'0', currency:'USD', dueDate:'', notes:'' }); refetch(); sumRefetch(); } },
  );

  const s = (summary as any) ?? {};
  const mrr            = s.mrr            ?? 0;
  const arr            = s.arr            ?? 0;
  const overdueCount   = s.overdueInvoices ?? 0;
  const invoicesByStatus = s.invoicesByStatus ?? [];
  const paidTotal      = invoicesByStatus.find((i: any) => i.status === 'PAID')?._sum?.total ?? 0;
  const pendingTotal   = invoicesByStatus.find((i: any) => i.status === 'SENT')?._sum?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      {sumLoading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{Array.from({length:4}).map((_,i) => <SkeletonCard key={i} />)}</div>
      ) : sumError ? (
        <ErrorState message={sumError} onRetry={sumRefetch} />
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label:'MRR',             value:`$${(mrr/1000).toFixed(0)}K`,         change:21.3,  color:'#0066ff', icon:DollarSign  },
            { label:'ARR',             value:`$${(arr/1_000_000).toFixed(2)}M`,    change:21.3,  color:'#7c3aed', icon:TrendingUp  },
            { label:'Collected (MTD)', value:`$${(paidTotal/1000).toFixed(0)}K`,   change:12.0,  color:'#10b981', icon:RefreshCw   },
            { label:'Overdue Invoices',value: overdueCount,                         change:-5.0,  color:'#ef4444', icon:AlertCircle },
          ].map(({ label, value, change, color, icon:Icon }, i) => (
            <motion.div key={label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
              className="dash-card">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:`${color}18`, border:`1px solid ${color}28` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${change >= 0 ? 'bg-emerald-500/12 text-emerald-400' : 'bg-red-500/12 text-red-400'}`}>
                  {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                </span>
              </div>
              <div className="font-display text-2xl font-bold text-white mb-1">{String(value)}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">{label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Invoice table */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
        className="dash-card overflow-hidden p-0">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex gap-1">
            {(['all','PAID','SENT','OVERDUE','DRAFT'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${tab === t ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-white/40 hover:text-white/70'}`}>
                {t === 'all' ? 'All' : t.toLowerCase()}
              </button>
            ))}
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary py-2 px-4 gap-2 text-xs">
            <Plus className="w-3.5 h-3.5" /> New Invoice
          </button>
        </div>

        {error ? (
          <div className="p-8"><ErrorState message={error} onRetry={refetch} /></div>
        ) : loading ? (
          <SkeletonTable rows={8} />
        ) : items.length === 0 ? (
          <div className="p-8"><EmptyState title="No invoices" description="No invoices match the selected filter." /></div>
        ) : (
          <>
            <table className="data-table">
              <thead><tr>{['Invoice #','Client','Amount','Issued','Due','Status',''].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {items.map((inv: any, i: number) => {
                  const c = statusColor(inv.status);
                  return (
                    <motion.tr key={inv.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.03 }}>
                      <td className="font-mono text-xs text-white/50">{inv.invoiceNumber}</td>
                      <td className="font-medium text-white/80">{inv.client?.name}</td>
                      <td className="font-display font-bold text-white">${inv.total?.toLocaleString()}</td>
                      <td className="text-white/40 text-xs">{new Date(inv.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                      <td className="text-white/40 text-xs">{new Date(inv.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                      <td>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded capitalize"
                          style={{ background:`${c}15`, color:c, border:`1px solid ${c}25` }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background:c }} />{inv.status?.toLowerCase()}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          {inv.status !== 'PAID' && inv.status !== 'CANCELLED' && (
                            <button onClick={() => markPaid(inv.id)} disabled={paying}
                              className="text-[10px] font-semibold px-2 py-1 rounded bg-emerald-500/12 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50">
                              Mark Paid
                            </button>
                          )}
                          <button className="text-white/25 hover:text-white/60 transition-colors p-1">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-5 py-3">
              <Pagination page={page} totalPages={totalPages} total={total} limit={15} onPageChange={setPage} />
            </div>
          </>
        )}
      </motion.div>

      {/* Create invoice modal */}
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
                <h3 className="font-display font-bold text-white">Create Invoice</h3>
                <button onClick={() => setShowCreate(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {([
                  { label:'Client ID *', key:'clientId', type:'text', placeholder:'client-globalpay' },
                  { label:'Amount ($)', key:'amount',   type:'number', placeholder:'8500'           },
                  { label:'Tax ($)',     key:'tax',      type:'number', placeholder:'0'              },
                  { label:'Currency',   key:'currency', type:'text', placeholder:'USD'              },
                  { label:'Due Date *', key:'dueDate',  type:'datetime-local', placeholder:''       },
                ] as { label:string; key: keyof typeof form; type:string; placeholder:string }[]).map(f => (
                  <div key={f.key} className={f.key === 'notes' ? 'sm:col-span-2' : ''}>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                    <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 transition-all" />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    rows={2} placeholder="Optional notes on this invoice"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 resize-none transition-all" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreate(false)} className="btn-ghost flex-1 py-2.5 text-xs">Cancel</button>
                <button disabled={creating || !form.clientId || !form.amount || !form.dueDate}
                  onClick={() => createInvoice({
                    clientId: form.clientId,
                    amount:   Number(form.amount),
                    tax:      Number(form.tax),
                    currency: form.currency,
                    dueDate:  new Date(form.dueDate).toISOString(),
                    notes:    form.notes || undefined,
                    lineItems:[{ description:'Service fee', qty:1, unitPrice:Number(form.amount), amount:Number(form.amount) }],
                  })}
                  className="btn-primary flex-1 py-2.5 text-xs gap-2 disabled:opacity-50">
                  {creating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Creating…</> : 'Create Invoice'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
