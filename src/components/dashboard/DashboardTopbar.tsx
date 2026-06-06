'use client';

import Link from 'next/link';
import { Bell, Settings, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { notifications } from '@/lib/data';

const breadcrumbs: Record<string, string> = {
  '/dashboard': 'Command Center',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/clients': 'CRM / Clients',
  '/dashboard/pipeline': 'Sales Pipeline',
  '/dashboard/projects': 'Projects',
  '/dashboard/tickets': 'Support Tickets',
  '/dashboard/billing': 'Billing',
  '/dashboard/documents': 'Documents',
  '/dashboard/security': 'Security',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/settings': 'Settings',
  '/dashboard/activity': 'Live Activity',
};

const unread = notifications.filter((n) => !n.read).length;

export default function DashboardTopbar() {
  const pathname = usePathname();
  const title = breadcrumbs[pathname] ?? 'Dashboard';

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#030712]/80 backdrop-blur-sm flex-shrink-0 z-10">
      <div>
        <h1 className="font-display text-lg font-bold text-white leading-none">{title}</h1>
        <p className="text-xs text-white/30 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/dashboard/notifications" className="relative w-9 h-9 rounded-lg glass border border-white/[0.07] flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-bold text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>
        <Link href="/dashboard/settings" className="w-9 h-9 rounded-lg glass border border-white/[0.07] flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
        </Link>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/[0.07] hover:border-white/[0.12] transition-all">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">A</div>
          <span className="text-xs text-white/60 hidden sm:block">Admin</span>
          <ChevronDown className="w-3 h-3 text-white/30" />
        </button>
      </div>
    </header>
  );
}
