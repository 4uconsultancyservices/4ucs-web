'use client';

import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, Lock, Key, Globe, Server, Eye, RefreshCw } from 'lucide-react';
import { ProgressBar } from '@/components/dashboard/widgets/StatCard';

const securityChecks = [
  { label: 'Multi-Factor Authentication', status: 'pass', icon: Lock },
  { label: 'SSL/TLS Certificates Valid', status: 'pass', icon: Shield },
  { label: 'SOC2 Type II Compliant', status: 'pass', icon: CheckCircle },
  { label: 'ISO 27001 Certified', status: 'pass', icon: CheckCircle },
  { label: 'GDPR Data Processing', status: 'pass', icon: Globe },
  { label: 'Penetration Test (Q1 2026)', status: 'pass', icon: Eye },
  { label: 'Dependency Vulnerabilities', status: 'warning', icon: AlertCircle },
  { label: 'API Key Rotation', status: 'warning', icon: Key },
  { label: 'Backup Encryption', status: 'pass', icon: Server },
];

const recentEvents = [
  { event: 'Admin login from new device', time: '2h ago', severity: 'info', ip: '192.168.1.45' },
  { event: 'Failed login attempt (x3)', time: '5h ago', severity: 'warning', ip: '45.33.32.156' },
  { event: 'API key rotated', time: '1d ago', severity: 'info', ip: 'System' },
  { event: 'Security scan completed', time: '2d ago', severity: 'success', ip: 'System' },
  { event: 'New IP whitelisted', time: '3d ago', severity: 'info', ip: '10.0.0.100' },
];

export default function SecurityPage() {
  const passCount = securityChecks.filter(c => c.status === 'pass').length;
  const score = Math.round((passCount / securityChecks.length) * 100);

  return (
    <div className="space-y-6">
      {/* Score + quick stats */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="dash-card flex items-center gap-6 lg:col-span-1">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <motion.circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - score / 100) }}
                transition={{ duration: 1.2, ease: 'easeOut' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="font-display text-2xl font-bold text-white">{score}</span>
              <span className="text-[9px] text-white/30 uppercase tracking-wider">Score</span>
            </div>
          </div>
          <div>
            <div className="font-display text-lg font-bold text-white mb-1">Security Score</div>
            <div className="text-sm text-emerald-400 font-medium">{passCount}/{securityChecks.length} checks passed</div>
            <div className="text-xs text-white/35 mt-1">Last scan: 2h ago</div>
            <button className="btn-ghost py-1.5 px-3 text-xs gap-1.5 mt-3"><RefreshCw className="w-3 h-3" /> Re-scan</button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="dash-card lg:col-span-2">
          <div className="font-display font-semibold text-white text-sm mb-4">Compliance Status</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'SOC2 Type II', level: 100, color: '#10b981', expiry: 'Mar 2027' },
              { label: 'ISO 27001', level: 100, color: '#10b981', expiry: 'Aug 2027' },
              { label: 'GDPR', level: 95, color: '#0066ff', expiry: 'Ongoing' },
              { label: 'PCI-DSS', level: 88, color: '#f59e0b', expiry: 'Renewal pending' },
            ].map(c => (
              <div key={c.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/60 font-semibold">{c.label}</span>
                  <span className="text-white/35">{c.expiry}</span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.level}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                    className="h-full rounded-full" style={{ background: c.color }} />
                </div>
                <div className="text-xs mt-1.5 font-semibold" style={{ color: c.color }}>{c.level}%</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Security checks + recent events */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="dash-card">
          <div className="font-display font-semibold text-white text-sm mb-4">Security Checklist</div>
          <div className="space-y-2.5">
            {securityChecks.map((c, i) => {
              const Icon = c.icon;
              const isPass = c.status === 'pass';
              return (
                <motion.div key={c.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isPass ? '#10b981' : '#f59e0b' }} />
                  <span className="flex-1 text-sm text-white/70">{c.label}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${isPass ? 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/12 text-amber-400 border border-amber-500/20'}`}>
                    {isPass ? 'Pass' : 'Review'}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="dash-card">
          <div className="font-display font-semibold text-white text-sm mb-4">Recent Security Events</div>
          <div className="space-y-1">
            {recentEvents.map((e, i) => {
              const sev = { info: '#0066ff', warning: '#f59e0b', success: '#10b981', error: '#ef4444' }[e.severity] ?? '#6b7280';
              return (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: sev, boxShadow: `0 0 6px ${sev}` }} />
                  <div className="flex-1">
                    <div className="text-sm text-white/75">{e.event}</div>
                    <div className="text-xs text-white/35 mt-0.5 font-mono">{e.ip}</div>
                  </div>
                  <div className="text-xs text-white/25 whitespace-nowrap">{e.time}</div>
                </motion.div>
              );
            })}
          </div>
          <button className="mt-4 text-xs text-blue-400 hover:text-blue-300">View audit log →</button>
        </motion.div>
      </div>

      {/* API Keys */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="dash-card">
        <div className="flex items-center justify-between mb-4">
          <div className="font-display font-semibold text-white text-sm">API Keys</div>
          <button className="btn-primary py-1.5 px-3 gap-1.5 text-xs"><Key className="w-3.5 h-3.5" /> Generate Key</button>
        </div>
        <table className="data-table">
          <thead><tr>{['Name','Key','Last Used','Created','Status',''].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              { name: 'Production API', key: 'sk-prod-••••••••3f9a', lastUsed: '2 min ago', created: 'Jan 1, 2026', status: 'active' },
              { name: 'Staging API', key: 'sk-stg-••••••••b2c7', lastUsed: '1 hour ago', created: 'Jan 15, 2026', status: 'active' },
              { name: 'Development', key: 'sk-dev-••••••••a1d4', lastUsed: '3 days ago', created: 'Feb 1, 2026', status: 'active' },
              { name: 'Legacy (deprecated)', key: 'sk-leg-••••••••e5f2', lastUsed: '30 days ago', created: 'Jun 1, 2025', status: 'inactive' },
            ].map((row, i) => (
              <motion.tr key={row.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.04 }}>
                <td className="font-medium text-white/80">{row.name}</td>
                <td className="font-mono text-xs text-white/40">{row.key}</td>
                <td className="text-white/35 text-xs">{row.lastUsed}</td>
                <td className="text-white/35 text-xs">{row.created}</td>
                <td>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${row.status === 'active' ? 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/20' : 'text-white/30 bg-white/[0.05] border border-white/[0.08]'}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <button className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Revoke</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
