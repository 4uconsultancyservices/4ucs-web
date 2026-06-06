'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Calendar, User, Tag } from 'lucide-react';
import { projects } from '@/lib/data';
import { StatusDot } from '@/components/dashboard/widgets/StatusHelpers';

const myProjects = projects.slice(0, 6);

export default function PortalProjectsPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'active' | 'complete' | 'upcoming'>('all');

  const filtered = myProjects.filter(p => {
    const matchTab = tab === 'all' || p.status === tab;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1">
          {(['all', 'active', 'complete', 'upcoming'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${tab === t ? 'bg-blue-500/20 text-blue-300 border border-blue-500/25' : 'text-white/40 hover:text-white/70'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…"
            className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none flex-1" />
        </div>
      </div>

      {/* Projects */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((p, i) => {
          const clr: Record<string, string> = { active: '#0066ff', complete: '#10b981', upcoming: '#7c3aed', 'on-hold': '#f59e0b' };
          const c = clr[p.status] ?? '#6b7280';
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="dash-card relative overflow-hidden cursor-pointer group hover:border-white/[0.14]">
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${c}, transparent)` }} />

              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-white mb-0.5">{p.name}</h3>
                  <div className="text-xs text-white/40">{p.clientName}</div>
                </div>
                <StatusDot status={p.status} />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-white/[0.08] text-white/40">
                    <Tag className="w-2.5 h-2.5" />{tag}
                  </span>
                ))}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/40">Progress</span>
                  <span className="font-mono font-bold text-white">{p.progress}%</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 + i * 0.05 }}
                    className="h-full rounded-full" style={{ background: c }} />
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/[0.05] text-xs text-white/35">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />{p.lead.split(' ')[0]}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />{new Date(p.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <button className="hover:text-white/60 transition-colors">Updates</button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
