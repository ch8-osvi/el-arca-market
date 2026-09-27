import AdminSidebar from '@/components/admin/AdminSidebar';
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[var(--color-obsidian)] overflow-hidden font-sans text-sm relative">
      <AdminSidebar />

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto p-3 md:pl-0">
        <div className="glass-panel w-full h-full p-4 md:p-6 overflow-y-auto relative rounded-xl">
          {children}
        </div>
      </main>
    </div>
  );
}
