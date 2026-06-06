'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Settings, Plus, ChevronDown } from 'lucide-react';

const breadcrumbs: Record<string, string> = {
  '/portal': 'Overview',
  '/portal/projects': 'Projects',
  '/portal/support': 'Support Tickets',
  '/portal/billing': 'Billing & Invoices',
  '/portal/documents': 'Document Center',
  '/portal/reports': 'Reports',
  '/portal/settings': 'Settings',
};

export default function PortalTopbar() {
  const pathname = usePathname();
  const title = breadcrumbs[pathname] ?? 'Portal';

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-sm flex-shrink-0 z-10">
      <div>
        <h1 className="font-display text-lg font-bold text-white leading-none">{title}</h1>
        <p className="text-xs text-white/30 mt-0.5">Acme Corp · Enterprise Plan</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn-primary py-2 px-4 text-xs gap-2">
          <Plus className="w-3.5 h-3.5" /> New Request
        </button>
        <Link href="/portal/support" className="relative w-9 h-9 rounded-lg glass border border-white/[0.07] flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </Link>
        <Link href="/portal/settings" className="w-9 h-9 rounded-lg glass border border-white/[0.07] flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
        </Link>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/[0.07] hover:border-white/[0.12] transition-all">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold text-white">A</div>
          <span className="text-xs text-white/60 hidden sm:block">Acme Corp</span>
          <ChevronDown className="w-3 h-3 text-white/30" />
        </button>
      </div>
    </header>
  );
}
