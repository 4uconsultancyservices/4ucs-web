'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, TrendingUp, Target, Users, Loader2, X } from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { dealsApi } from '@/lib/api-client';
import { PageLoader, ErrorState, SkeletonCard } from '@/components/ui/states';

const STAGE_META: Record<string, { color: string; label: string }> = {
  PROSPECT:    { color: '#60b0ff', label: 'Prospect'    },
  QUALIFIED:   { color: '#0066ff', label: 'Qualified'   },
  PROPOSAL:    { color: '#7c3aed', label: 'Proposal'    },
  NEGOTIATION: { color: '#22d3ee', label: 'Negotiation' },
  WON:         { color: '#10b981', label: 'Won'         },
  LOST:        { color: '#ef4444', label: 'Lost'        },
};

export default function PipelinePage() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title:'', value:'', stage:'PROSPECT', probability:'20', assignedToId:'', clientId:'', notes:'' });

  const { data, loading, error, refetch } = useApi(() => dealsApi.pipeline() as any, []);
  const { data: perf, loading: perfLoading } = useApi(() => dealsApi.performance() as any, []);

  const { mutate: updateStage } = useMutation(
    ({ id, stage }: any) => dealsApi.updateStage(id, { stage }) as any,
    { onSuccess: () => refetch() },
  );

  const { mutate: createDeal, loading: creating } = useMutation(
    (body) => dealsApi.create(body) as any,
    { onSuccess: () => { setShowCreate(false); setForm({ title:'', value:'', stage:'PROSPECT', probability:'20', assignedToId:'', clientId:'', notes:'' }); refetch(); } },
  );

  if (loading) return <PageLoader message="Loading pipeline…" />;
  if (error)   return <ErrorState message={error} onRetry={refetch} />;

  const board     = (data as any[]) ?? [];
  const p         = (perf as any) ?? {};
  const totalValue = board.reduce((s: number, col: any) => s + (col.totalValue ?? 0), 0);

  const summaryStats = [
    { label: 'Total Pipeline',  value: `$${(totalValue/1000).toFixed(0)}K`,                 color: '#0066ff', icon: DollarSign },
    { label: 'Weighted Value',  value: `$${((p.totalPipeline ?? 0)/1000).toFixed(0)}K`,     color: '#7c3aed', icon: Target     },
    { label: 'Won Revenue',     value: `$${((p.wonRevenue ?? 0)/1000).toFixed(0)}K`,        color: '#10b981', icon: TrendingUp },
    { label: 'Win Rate',        value: `${p.winRate ?? 0}%`,                                color: '#22d3ee', icon: Users      },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      {perfLoading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{Array.from({length:4}).map((_,i)=><SkeletonCard key={i}/>)}</div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryStats.map((s,i)=>{
            const Icon=s.icon;
            return (
              <motion.div key={s.label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}} className="dash-card flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${s.color}18`,border:`1px solid ${s.color}28`}}>
                  <Icon className="w-5 h-5" style={{color:s.color}}/>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/40">{s.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add deal button */}
      <div className="flex justify-end">
        <button onClick={()=>setShowCreate(true)} className="btn-primary py-2 px-5 gap-2 text-sm">
          <Plus className="w-4 h-4"/> New Deal
        </button>
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {board.map((col:any) => {
            const meta = STAGE_META[col.stage] ?? { color:'#6b7280', label: col.stage };
            return (
              <motion.div key={col.stage} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-[260px] flex flex-col">
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{background:meta.color}}/>
                    <span className="text-sm font-semibold text-white">{meta.label}</span>
                    <span className="text-xs text-white/30 bg-white/[0.05] px-1.5 py-0.5 rounded-full">{col.count}</span>
                  </div>
                  <span className="text-xs font-mono text-white/40">${((col.totalValue??0)/1000).toFixed(0)}K</span>
                </div>
                <div className="h-0.5 rounded-full mb-3" style={{background:`linear-gradient(90deg,${meta.color},transparent)`}}/>

                {/* Deal cards */}
                <div className="space-y-2.5 flex-1">
                  {col.deals?.map((deal:any) => (
                    <motion.div key={deal.id} whileHover={{y:-2}}
                      className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/40 to-violet-600/40 flex items-center justify-center text-[10px] font-bold text-white">
                            {(deal.title??'??').slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white leading-tight truncate max-w-[140px]">{deal.title}</div>
                            <div className="text-[10px] text-white/35">{deal.client?.name ?? deal.assignedTo?.name ?? '—'}</div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-white">${((deal.value??0)/1000).toFixed(0)}K</div>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1 bg-white/[0.07] rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500" style={{width:`${deal.probability??0}%`}}/>
                          </div>
                          <span className="text-white/45 font-mono">{deal.probability}%</span>
                        </div>
                        {/* Stage move buttons */}
                        <div className="flex gap-1">
                          {col.stage !== 'WON' && col.stage !== 'LOST' && (
                            <button onClick={()=>updateStage({id:deal.id, stage:'WON'})}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-all">
                              Win
                            </button>
                          )}
                          {col.stage !== 'LOST' && col.stage !== 'WON' && (
                            <button onClick={()=>updateStage({id:deal.id, stage:'LOST'})}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-all">
                              Lost
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {col.deals?.length === 0 && (
                    <div className="py-6 text-center text-white/20 text-xs border border-dashed border-white/[0.08] rounded-xl">
                      No deals
                    </div>
                  )}
                  <button onClick={()=>setShowCreate(true)}
                    className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.1] text-white/25 hover:text-white/50 hover:border-white/[0.2] transition-all text-xs flex items-center justify-center gap-1.5">
                    <Plus className="w-3.5 h-3.5"/> Add deal
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Create Deal modal */}
      {showCreate && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={()=>setShowCreate(false)}>
          <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm"/>
          <motion.div initial={{scale:0.97,y:10}} animate={{scale:1,y:0}}
            onClick={e=>e.stopPropagation()}
            className="relative w-full max-w-lg glass-card rounded-2xl border border-white/[0.12] p-6 space-y-4 shadow-enterprise">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-white">New Deal</h3>
              <button onClick={()=>setShowCreate(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {([
                {label:'Deal Title *', key:'title',       type:'text',   placeholder:'Acme Corp — Cloud Migration'},
                {label:'Value ($) *',  key:'value',       type:'number', placeholder:'85000'},
                {label:'Probability',  key:'probability', type:'number', placeholder:'50'},
                {label:'Client ID',    key:'clientId',    type:'text',   placeholder:'client-globalpay'},
              ] as {label:string;key:keyof typeof form;type:string;placeholder:string}[]).map(f=>(
                <div key={f.key}>
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                  <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                    onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 transition-all"/>
                </div>
              ))}
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Stage</label>
                <select value={form.stage} onChange={e=>setForm(p=>({...p,stage:e.target.value}))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none cursor-pointer">
                  {Object.entries(STAGE_META).map(([k,v])=>(
                    <option key={k} value={k} className="bg-[#060d1f]">{v.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Notes</label>
                <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={2}
                  placeholder="Optional notes…"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 resize-none transition-all"/>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={()=>setShowCreate(false)} className="btn-ghost flex-1 py-2.5 text-xs">Cancel</button>
              <button disabled={creating||!form.title||!form.value}
                onClick={()=>createDeal({title:form.title,value:Number(form.value),stage:form.stage,probability:Number(form.probability),clientId:form.clientId||undefined,notes:form.notes||undefined})}
                className="btn-primary flex-1 py-2.5 text-xs gap-2 disabled:opacity-50">
                {creating?<><Loader2 className="w-3.5 h-3.5 animate-spin"/>Creating…</>:'Create Deal'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
