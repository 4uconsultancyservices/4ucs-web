import type { Metadata } from 'next';
import PortalSidebar from '@/components/portal/PortalSidebar';
import PortalTopbar from '@/components/portal/PortalTopbar';

export const metadata: Metadata = {
  title: { default: 'Client Portal', template: '%s | 4UCS Portal' },
  description: '4UCS Client Portal — Your project and service hub',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#030712] overflow-hidden">
      <PortalSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PortalTopbar />
        <main className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
