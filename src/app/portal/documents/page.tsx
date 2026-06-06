'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Eye, FileText, Upload, Filter } from 'lucide-react';
import { documents } from '@/lib/data';
import { DocTypeBadge } from '@/components/dashboard/widgets/StatusHelpers';

export default function PortalDocumentsPage() {
  const [search, setSearch] = useState('');
  const filtered = documents.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents…"
            className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none flex-1" />
        </div>
        <button className="btn-ghost py-2 px-4 gap-2 text-xs"><Filter className="w-3.5 h-3.5" /> Filter</button>
        <button className="btn-primary py-2 px-4 gap-2 text-xs"><Upload className="w-3.5 h-3.5" /> Upload</button>
      </div>

      {/* Document cards */}
      <div className="space-y-2">
        {filtered.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all group cursor-pointer">
            <DocTypeBadge type={d.type} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white/85 text-sm truncate">{d.name}</div>
              <div className="text-xs text-white/35 mt-0.5">{d.size} · Uploaded by {d.uploadedBy} · {new Date(d.uploadedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
              <button className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-colors"><Download className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <div className="text-sm">No documents found.</div>
          </div>
        )}
      </div>
    </div>
  );
}
