'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, BarChart3, Settings, FileText,
  Ticket, CreditCard, Bell, ChevronLeft, ChevronRight,
  Building2, Workflow, Shield, Sparkles, Activity,
  LogOut, HelpCircle, Search, ChevronDown,
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: Activity, label: 'Live Activity', href: '/dashboard/activity', badge: 'Live' },
      { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    ],
  },
  {
    label: 'Business',
    items: [
      { icon: Users, label: 'CRM / Clients', href: '/dashboard/clients', badge: '108' },
      { icon: Workflow, label: 'Pipeline', href: '/dashboard/pipeline' },
      { icon: Building2, label: 'Projects', href: '/dashboard/projects' },
      { icon: Ticket, label: 'Tickets', href: '/dashboard/tickets', badge: '5' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: FileText, label: 'Documents', href: '/dashboard/documents' },
      { icon: Shield, label: 'Security', href: '/dashboard/security' },
      { icon: Bell, label: 'Notifications', href: '/dashboard/notifications', badge: '3' },
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcut ⌘K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 68 : 248 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className="relative h-screen flex flex-col bg-[#060d1f] border-r border-white/[0.06] z-20 flex-shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className={cn('flex items-center h-16 px-4 border-b border-white/[0.06] flex-shrink-0 gap-3', collapsed && 'justify-center')}>
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg" />
            <div className="absolute inset-0.5 bg-[#060d1f] rounded-md flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="min-w-0">
                <div className="text-sm font-bold text-white font-display leading-none">4UCS</div>
                <div className="text-[10px] text-white/30 tracking-widest uppercase mt-0.5">Admin</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-3 pt-3 flex-shrink-0">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/30 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] hover:text-white/50 transition-all"
              >
                <Search className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="flex-1 text-left">Search...</span>
                <kbd className="text-[10px] bg-white/[0.06] px-1.5 py-0.5 rounded">⌘K</kbd>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 no-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[10px] font-semibold uppercase tracking-widest text-white/20 px-2 mb-1.5">
                    {group.label}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href}
                      className={cn('sidebar-item relative', active && 'active', collapsed && 'justify-center px-0')}
                      title={collapsed ? item.label : undefined}
                    >
                      {active && !collapsed && (
                        <motion.div layoutId="dash-active-bar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-blue-400" />
                      )}
                      <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-blue-400' : '')} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 whitespace-nowrap">
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {!collapsed && item.badge && (
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                          item.badge === 'Live'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/25'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/25')}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="p-3 border-t border-white/[0.06] space-y-0.5 flex-shrink-0">
          <Link href="#" className={cn('sidebar-item', collapsed && 'justify-center px-0')} title={collapsed ? 'Help' : undefined}>
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence>{!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Help & Docs</motion.span>}</AnimatePresence>
          </Link>
          <Link href="/" className={cn('sidebar-item', collapsed && 'justify-center px-0')} title={collapsed ? 'Sign Out' : undefined}>
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence>{!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Sign Out</motion.span>}</AnimatePresence>
          </Link>
          {/* User */}
          <div className={cn('flex items-center gap-2.5 px-2.5 py-2 mt-1 rounded-xl bg-white/[0.03] border border-white/[0.05]', collapsed && 'justify-center px-0')}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">A</div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">Admin User</div>
                  <div className="text-[10px] text-white/30 truncate">admin@4ucs.com</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-[#0a1628] border border-white/[0.12] flex items-center justify-center text-white/50 hover:text-white transition-colors shadow-lg z-30"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Command palette overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl glass-card rounded-2xl border border-white/[0.12] overflow-hidden shadow-enterprise"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
                <Search className="w-4 h-4 text-white/40" />
                <input autoFocus type="text" placeholder="Search pages, clients, tickets..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none" />
                <kbd className="text-[10px] text-white/30 bg-white/[0.06] px-2 py-1 rounded">Esc</kbd>
              </div>
              <div className="p-3 space-y-1">
                {[
                  { label: 'Dashboard', href: '/dashboard', cat: 'Page' },
                  { label: 'Analytics', href: '/dashboard/analytics', cat: 'Page' },
                  { label: 'CRM / Clients', href: '/dashboard/clients', cat: 'Page' },
                  { label: 'Open Tickets', href: '/dashboard/tickets', cat: 'Page' },
                  { label: 'Billing', href: '/dashboard/billing', cat: 'Page' },
                  { label: 'Security', href: '/dashboard/security', cat: 'Page' },
                ].map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group">
                    <span className="text-sm text-white/70 group-hover:text-white">{item.label}</span>
                    <span className="text-[10px] text-white/25 uppercase tracking-wider">{item.cat}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
