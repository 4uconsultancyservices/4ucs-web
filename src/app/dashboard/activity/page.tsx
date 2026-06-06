'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Users, AlertCircle, Zap, Shield, DollarSign, FileText, Settings, Activity } from 'lucide-react';

const activityFeed = [
  { icon: CheckCircle, title: 'Deployment successful', desc: 'RetailFlow production v2.3.1 deployed — zero downtime across 3 regions', time: '2 min ago', color: '#10b981', user: 'CI/CD Bot' },
  { icon: Users, title: 'New enterprise signup', desc: 'Pinnacle Retail signed up for Enterprise plan ($8,500/mo)', time: '14 min ago', color: '#0066ff', user: 'System' },
  { icon: AlertCircle, title: 'Critical ticket opened', desc: 'TKT-2041: API rate limiting configuration at Apex Financial', time: '1 hr ago', color: '#ef4444', user: 'Chen Wei' },
  { icon: DollarSign, title: 'Invoice paid', desc: 'GlobalPay INV-2026-051 — $8,500 received via Stripe', time: '3 hr ago', color: '#10b981', user: 'Stripe' },
  { icon: Zap, title: 'Auto-scale triggered', desc: 'ScaleForce cluster scaled 1→3 nodes (CPU: 87%)', time: '5 hr ago', color: '#7c3aed', user: 'CloudWatch' },
  { icon: Shield, title: 'Security scan completed', desc: 'SOC2 controls audit — 0 critical findings, 2 low-risk notes', time: '8 hr ago', color: '#22d3ee', user: 'Vanta' },
  { icon: FileText, title: 'Document uploaded', desc: 'GlobalPay Architecture Blueprint v3.pdf (4.2 MB)', time: '12 hr ago', color: '#f59e0b', user: 'Alex Martinez' },
  { icon: Settings, title: 'Config change', desc: 'Production DB connection pool increased to 100', time: '1 day ago', color: '#6b7280', user: 'Sarah Kim' },
  { icon: Users, title: 'Client onboarded', desc: 'Apex Financial onboarding completed — 7 users provisioned', time: '1 day ago', color: '#0066ff', user: 'Kevin Park' },
  { icon: AlertCircle, title: 'TKT-2034 updated', desc: 'ScaleForce APAC latency — CDN rules deployed, monitoring', time: '2 days ago', color: '#f59e0b', user: 'Alex Martinez' },
  { icon: DollarSign, title: 'MRR milestone', desc: 'Platform crossed $460K MRR for the first time', time: '3 days ago', color: '#10b981', user: 'System' },
  { icon: CheckCircle, title: 'SOC2 audit completed', desc: 'HealthFirst Systems — full certification achieved', time: '4 days ago', color: '#10b981', user: 'James Rivera' },
];

export default function ActivityPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Live indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/12 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-400">Live Feed</span>
        </div>
        <span className="text-xs text-white/30">{activityFeed.length} events · Updates every 30s</span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/[0.06]" />

        <div className="space-y-1">
          {activityFeed.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="relative flex items-start gap-5 py-4 group">
                {/* Icon circle */}
                <div className="relative z-10 w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}15`, borderColor: `${item.color}30`, boxShadow: `0 0 0 3px #030712` }}>
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 bg-white/[0.01] hover:bg-white/[0.03] border border-transparent hover:border-white/[0.05] rounded-xl p-3 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-sm text-white">{item.title}</div>
                      <div className="text-sm text-white/50 mt-0.5 leading-relaxed">{item.desc}</div>
                    </div>
                    <div className="text-xs text-white/25 whitespace-nowrap flex-shrink-0">{item.time}</div>
                  </div>
                  <div className="mt-2 text-xs text-white/30">by <span className="text-white/45">{item.user}</span></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="text-center py-6">
        <button className="btn-ghost py-2.5 px-6 text-xs">Load older events</button>
      </div>
    </div>
  );
}
