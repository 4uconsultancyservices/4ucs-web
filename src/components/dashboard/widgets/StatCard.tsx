'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change: number;
  prefix?: string;
  suffix?: string;
  color: string;
  icon: React.ElementType;
  index?: number;
  description?: string;
}

export function StatCard({ label, value, change, prefix = '', suffix = '', color, icon: Icon, index = 0, description }: StatCardProps) {
  const positive = change > 0;
  const neutral = change === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07, duration: 0.45 }}
      className="dash-card group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-8 transition-opacity duration-500"
        style={{ background: color, filter: 'blur(30px)', transform: 'translate(30%,-30%)' }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className={cn('flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg',
          positive ? 'bg-emerald-500/12 text-emerald-400' : neutral ? 'bg-white/[0.06] text-white/40' : 'bg-red-500/12 text-red-400')}>
          {positive ? <TrendingUp className="w-3 h-3" /> : neutral ? <Minus className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="font-display text-2xl font-bold text-white mb-1">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</div>
      <div className="text-xs text-white/40 uppercase tracking-wider">{label}</div>
      {description && <div className="text-xs text-white/25 mt-1">{description}</div>}
    </motion.div>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  suffix?: string;
  className?: string;
}

export function ProgressBar({ label, value, max = 100, color = '#0066ff', suffix = '%', className = '' }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={cn('mb-4 last:mb-0', className)}>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-white/55">{label}</span>
        <span className="text-white font-mono font-semibold">{value}{suffix !== '%' ? ` ${suffix}` : suffix}</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
          className="h-full rounded-full" style={{ background: `linear-gradient(90deg,${color},${color}90)` }} />
      </div>
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  color: string;
  index?: number;
}

export function ActivityItem({ icon: Icon, title, description, time, color, index = 0 }: ActivityItemProps) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 py-3 border-b border-white/[0.04] last:border-0 group">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{title}</div>
        <div className="text-xs text-white/40 mt-0.5 truncate">{description}</div>
      </div>
      <div className="text-[10px] text-white/25 flex-shrink-0 mt-1 whitespace-nowrap">{time}</div>
    </motion.div>
  );
}
