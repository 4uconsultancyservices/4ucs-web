'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Loader2, FolderOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useMutation, usePaginatedApi } from '@/hooks/useApi';
import { projectsApi } from '@/lib/api-client';
import { SkeletonGrid, ErrorState, EmptyState, Pagination } from '@/components/ui/states';
import { StatusDot } from '@/components/dashboard/widgets/StatusHelpers';
import { useDebounce } from '@/hooks/index';

const STATUS_COLOR: Record<string,string> = {
  ACTIVE:'#0066ff', COMPLETE:'#10b981', PLANNING:'#7c3aed', ON_HOLD:'#f59e0b', CANCELLED:'#ef4444',
};

export default function ProjectsPage() {
  const [search,     setSearch]     = useState('');
  const [tab,        setTab]        = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name:'', clientId:'', budget:'', startDate:'', dueDate:'', description:'' });

  const debouncedSearch = useDebounce(search, 400);

  const { items, total, page, totalPages, loading, error, setPage, refetch } = usePaginatedApi(
    (p) => projectsApi.list({ page:p, limit:12, search:debouncedSearch||undefined, status:tab==='all'?undefined:tab }) as any,
    [debouncedSearch, tab],
  );

  const { mutate: createProject, loading: creating } = useMutation(
    (body) => projectsApi.create(body) as any,
    { onSuccess:()=>{ setShowCreate(false); setForm({name:'',clientId:'',budget:'',startDate:'',dueDate:'',description:''}); refetch(); } },
  );

  const summary = {
    total:    items.length,
    active:   items.filter((p:any)=>p.status==='ACTIVE').length,
    complete: items.filter((p:any)=>p.status==='COMPLETE').length,
    budget:   items.reduce((s:number,p:any)=>s+(p.budget??0),0),
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {label:'Showing',    value:total,                   icon:FolderOpen, color:'#0066ff'},
          {label:'Active',     value:summary.active,          icon:Clock,      color:'#7c3aed'},
          {label:'Completed',  value:summary.complete,        icon:CheckCircle,color:'#10b981'},
          {label:'Total Budget',value:`$${(summary.budget/1000).toFixed(0)}K`, icon:AlertCircle,color:'#f59e0b'},
        ].map(({label,value,icon:Icon,color},i)=>(
          <motion.div key={label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className="dash-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${color}18`,border:`1px solid ${color}28`}}>
              <Icon className="w-5 h-5" style={{color}}/>
            </div>
            <div>
              <div className="font-display text-xl font-bold text-white">{String(value)}</div>
              <div className="text-xs text-white/40">{label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1">
          {['all','ACTIVE','COMPLETE','PLANNING','ON_HOLD'].map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${tab===t?'bg-blue-500/20 text-blue-300 border border-blue-500/25':'text-white/40 hover:text-white/70'}`}>
              {t==='all'?'All':t.replace('_',' ').toLowerCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-white/30"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects…"
            className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none flex-1"/>
        </div>
        <button onClick={()=>setShowCreate(true)} className="btn-primary py-2 px-4 gap-2 text-xs">
          <Plus className="w-3.5 h-3.5"/> New Project
        </button>
      </div>

      {/* Grid */}
      {error ? (
        <ErrorState message={error} onRetry={refetch}/>
      ) : loading ? (
        <SkeletonGrid count={6}/>
      ) : items.length===0 ? (
        <EmptyState title="No projects found" description="Try a different filter or create a new project." action={{label:'+ New Project',onClick:()=>setShowCreate(true)}}/>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((p:any,i:number)=>{
              const color = STATUS_COLOR[p.status] ?? '#6b7280';
              return (
                <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} whileHover={{y:-4}}
                  className="dash-card cursor-pointer group relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{background:`linear-gradient(90deg,${color},transparent)`}}/>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-display font-semibold text-white text-sm mb-0.5">{p.name}</div>
                      <div className="text-xs text-white/40">{p.client?.name}</div>
                    </div>
                    <StatusDot status={p.status?.toLowerCase().replace('_','-')}/>
                  </div>
                  {p.tags?.length>0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {p.tags.slice(0,3).map((tag:string)=>(
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.08] text-white/40">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/40">Progress</span>
                      <span className="font-mono font-bold text-white">{p.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div initial={{width:0}} animate={{width:`${p.progress}%`}} transition={{duration:0.8,ease:'easeOut',delay:0.3+i*0.04}}
                        className="h-full rounded-full" style={{background:color}}/>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/35 pt-3 border-t border-white/[0.05]">
                    <span>${(p.budget/1000).toFixed(0)}K budget</span>
                    {p.dueDate && <span>Due {new Date(p.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} limit={12} onPageChange={setPage}/>
        </>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={()=>setShowCreate(false)}>
            <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm"/>
            <motion.div initial={{scale:0.97,y:10}} animate={{scale:1,y:0}} exit={{scale:0.97,y:10}}
              onClick={e=>e.stopPropagation()}
              className="relative w-full max-w-lg glass-card rounded-2xl border border-white/[0.12] p-6 space-y-4 shadow-enterprise">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-white">New Project</h3>
                <button onClick={()=>setShowCreate(false)} className="text-white/30 hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {([
                  {label:'Project Name *',key:'name',       type:'text',          placeholder:'Cloud Migration Phase 3'},
                  {label:'Client ID *',   key:'clientId',   type:'text',          placeholder:'client-globalpay'},
                  {label:'Budget ($)',     key:'budget',     type:'number',        placeholder:'85000'},
                  {label:'Start Date',    key:'startDate',  type:'datetime-local',placeholder:''},
                  {label:'Due Date',      key:'dueDate',    type:'datetime-local', placeholder:''},
                ] as {label:string;key:keyof typeof form;type:string;placeholder:string}[]).map(f=>(
                  <div key={f.key}>
                    <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">{f.label}</label>
                    <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                      onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 transition-all"/>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-xs text-white/40 uppercase tracking-wider mb-1.5 block">Description</label>
                  <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={2}
                    placeholder="Brief project description…"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-blue-500/50 resize-none transition-all"/>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setShowCreate(false)} className="btn-ghost flex-1 py-2.5 text-xs">Cancel</button>
                <button disabled={creating||!form.name||!form.clientId}
                  onClick={()=>createProject({name:form.name,clientId:form.clientId,budget:Number(form.budget)||undefined,startDate:form.startDate?new Date(form.startDate).toISOString():undefined,dueDate:form.dueDate?new Date(form.dueDate).toISOString():undefined,description:form.description||undefined,tags:[]})}
                  className="btn-primary flex-1 py-2.5 text-xs gap-2 disabled:opacity-50">
                  {creating?<><Loader2 className="w-3.5 h-3.5 animate-spin"/>Creating…</>:'Create Project'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
