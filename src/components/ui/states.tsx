'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Inbox, Loader2 } from 'lucide-react';

// ── Skeleton loaders ──────────────────────────────────────────
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`dash-card space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-8 w-8 rounded-xl" />
      </div>
      <div className="skeleton h-7 w-24 rounded" />
      <div className="skeleton h-3 w-40 rounded" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr className="border-b border-white/[0.04]">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 rounded" style={{ width: `${60 + i * 15}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {Array.from({ length: 5 }).map((_, i) => (
            <th key={i}><div className="skeleton h-3 rounded w-20" /></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} />)}
      </tbody>
    </table>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

// ── Inline spinner ────────────────────────────────────────────
export function Spinner({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <Loader2
      className={`animate-spin text-blue-400 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

// ── Full-page loading ─────────────────────────────────────────
export function PageLoader({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-2 border-white/[0.06]" />
        <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
      </div>
      <p className="text-sm text-white/40">{message}</p>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────
export function ErrorState({
  message = 'Something went wrong',
  onRetry,
}: { message?: string; onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-red-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-white/70 mb-1">Failed to load</p>
        <p className="text-xs text-white/40 max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-ghost py-2 px-4 text-xs gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Try again
        </button>
      )}
    </motion.div>
  );
}

// ── Empty state ───────────────────────────────────────────────
export function EmptyState({
  title = 'No results',
  description = 'Nothing here yet.',
  action,
}: {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 py-16 text-center"
    >
      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
        <Inbox className="w-6 h-6 text-white/25" />
      </div>
      <div>
        <p className="text-sm font-medium text-white/60 mb-1">{title}</p>
        <p className="text-xs text-white/30 max-w-xs">{description}</p>
      </div>
      {action && (
        <button onClick={action.onClick} className="btn-primary py-2 px-4 text-xs">
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

// ── Pagination controls ───────────────────────────────────────
export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}) {
  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
      <span className="text-xs text-white/35">
        Showing {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          Previous
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = i + Math.max(1, page - 2);
          if (p > totalPages) return null;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                p === page
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}
