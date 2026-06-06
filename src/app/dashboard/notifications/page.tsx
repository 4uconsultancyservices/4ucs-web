'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle, Check, Trash2 } from 'lucide-react';
import { notifications } from '@/lib/data';
import type { Notification } from '@/types';

const typeConfig = {
  success: { icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  error: { icon: AlertCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  info: { icon: Info, color: '#0066ff', bg: 'rgba(0,102,255,0.1)', border: 'rgba(0,102,255,0.2)' },
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(notifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const remove = (id: string) => setItems(prev => prev.filter(n => n.id !== id));

  const unread = items.filter(n => !n.read).length;
  const displayed = filter === 'unread' ? items.filter(n => !n.read) : items;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-400" />
            <span className="font-display text-lg font-bold text-white">Notifications</span>
            {unread > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/25">{unread} unread</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'unread'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all capitalize ${filter === f ? 'bg-blue-500/20 text-blue-300 border border-blue-500/25' : 'text-white/40 hover:text-white/70'}`}>
              {f}
            </button>
          ))}
          <button onClick={markAllRead} className="btn-ghost py-1.5 px-3 text-xs gap-1.5">
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        <AnimatePresence>
          {displayed.map((n, i) => {
            const cfg = typeConfig[n.type];
            const Icon = cfg.icon;
            return (
              <motion.div key={n.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all ${!n.read ? 'bg-white/[0.03]' : 'bg-transparent opacity-60 hover:opacity-80'}`}
                style={{ borderColor: !n.read ? cfg.border : 'rgba(255,255,255,0.05)' }}
              >
                {/* Unread dot */}
                {!n.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full" style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
                )}

                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-sm text-white mb-0.5">{n.title}</div>
                      <div className="text-sm text-white/50 leading-relaxed">{n.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-white/25">
                      {new Date(n.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        Mark read
                      </button>
                    )}
                  </div>
                </div>

                <button onClick={() => remove(n.id)} className="text-white/15 hover:text-red-400/70 transition-colors mt-1 flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {displayed.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <div className="text-sm">No {filter === 'unread' ? 'unread' : ''} notifications</div>
          </div>
        )}
      </div>
    </div>
  );
}
