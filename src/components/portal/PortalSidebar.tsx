'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FolderOpen, Ticket, CreditCard, FileText, BarChart3, Settings, LogOut, Sparkles, HelpCircle } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/portal' },
  { icon: FolderOpen, label: 'Projects', href: '/portal/projects' },
  { icon: Ticket, label: 'Support', href: '/portal/support', badge: '2' },
  { icon: CreditCard, label: 'Billing', href: '/portal/billing' },
  { icon: FileText, label: 'Documents', href: '/portal/documents' },
  { icon: BarChart3, label: 'Reports', href: '/portal/reports' },
  { icon: Settings, label: 'Settings', href: '/portal/settings' },
];

export default function PortalSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 h-screen flex flex-col bg-[#060d1f] border-r border-white/[0.06] flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-white/[0.06] flex-shrink-0">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg" />
          <div className="absolute inset-0.5 bg-[#060d1f] rounded-md flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-white font-display leading-none">4UCS</div>
          <div className="text-[10px] text-white/30 tracking-widest uppercase mt-0.5">Client Portal</div>
        </div>
      </div>

      {/* Client pill */}
      <div className="px-4 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">A</div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">Acme Corp</div>
            <div className="text-[10px] text-violet-400 font-medium">Enterprise Plan</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn('sidebar-item relative', active && 'active')}>
              {active && (
                <motion.div layoutId="portal-active-bar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-blue-400" />
              )}
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-blue-400' : '')} />
              <span className="flex-1">{item.label}</span>
              {'badge' in item && item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/25">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/[0.06] space-y-0.5 flex-shrink-0">
        <Link href="#" className="sidebar-item"><HelpCircle className="w-4 h-4" />Help & Support</Link>
        <Link href="/" className="sidebar-item"><LogOut className="w-4 h-4" />Sign Out</Link>
      </div>
    </aside>
  );
}
