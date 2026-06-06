import type { Metadata } from 'next';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopbar from '@/components/dashboard/DashboardTopbar';

export const metadata: Metadata = {
  title: { default: 'Admin Dashboard', template: '%s | 4UCS Admin' },
  description: '4UCS Enterprise Admin Command Center',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#030712] overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
