'use client';

import { motion } from 'framer-motion';
import { Search, Plus, Upload, Download, Filter, FileText, Eye } from 'lucide-react';
import { useState } from 'react';
import { documents } from '@/lib/data';
import { DocTypeBadge } from '@/components/dashboard/widgets/StatusHelpers';

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const filtered = documents.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.clientName ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const byType = (type: string) => documents.filter(d => d.type === type).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: documents.length, color: '#0066ff' },
          { label: 'PDFs', value: byType('pdf'), color: '#ef4444' },
          { label: 'Word Docs', value: byType('doc'), color: '#0066ff' },
          { label: 'Spreadsheets', value: byType('xls'), color: '#10b981' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="dash-card text-center py-4">
            <div className="font-display text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-white/40 uppercase tracking-wider">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents…"
            className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none flex-1" />
        </div>
        <button className="btn-ghost py-2 px-4 gap-2 text-xs"><Filter className="w-3.5 h-3.5" /> Filter</button>
        <button className="btn-primary py-2 px-4 gap-2 text-xs"><Upload className="w-3.5 h-3.5" /> Upload</button>
      </div>

      {/* Documents grid */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="dash-card overflow-hidden p-0">
        <table className="data-table">
          <thead><tr>{['Type','Name','Client','Size','Uploaded By','Date',''].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((d, i) => (
              <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="group cursor-pointer">
                <td><DocTypeBadge type={d.type} /></td>
                <td>
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-white/25 flex-shrink-0" />
                    <span className="font-medium text-white/80 max-w-[220px] truncate">{d.name}</span>
                  </div>
                </td>
                <td className="text-white/40">{d.clientName ?? <span className="text-white/20">—</span>}</td>
                <td className="font-mono text-xs text-white/40">{d.size}</td>
                <td className="text-white/40">{d.uploadedBy}</td>
                <td className="text-white/35 text-xs">{new Date(d.uploadedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                <td>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-white/30 hover:text-white/70 transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="text-white/30 hover:text-white/70 transition-colors"><Download className="w-4 h-4" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
