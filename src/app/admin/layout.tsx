import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[var(--color-obsidian)] overflow-hidden font-sans text-sm">
      {/* Admin Sidebar */}
      <aside className="w-56 glass-card m-3 flex flex-col overflow-hidden shrink-0 border-white/10 rounded-xl">
        <div className="p-4 border-b border-white/5 flex flex-col gap-1">
          <h2 className="text-lg font-black tracking-tight">
            ADMIN <span className="gold-gradient-text">PANEL</span>
          </h2>
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest font-bold">
            El Arca Market
          </p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          <Link href="/admin" className="px-3 py-2 rounded-lg bg-white/5 text-white hover:bg-[#D4AF37]/20 hover:text-[#E5C158] transition-colors font-semibold flex items-center gap-2.5 border border-transparent hover:border-[#D4AF37]/30 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Dashboard
          </Link>
          <Link href="/admin/inventory" className="px-3 py-2 rounded-lg bg-transparent text-white/70 hover:bg-[#D4AF37]/20 hover:text-[#E5C158] transition-colors font-semibold flex items-center gap-2.5 border border-transparent hover:border-[#D4AF37]/30 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            Almacén y Lotes
          </Link>
          <Link href="/admin/products" className="px-3 py-2 rounded-lg bg-transparent text-white/70 hover:bg-[#D4AF37]/20 hover:text-[#E5C158] transition-colors font-semibold flex items-center gap-2.5 border border-transparent hover:border-[#D4AF37]/30 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
            Catálogo
          </Link>
          <Link href="/admin/sales" className="px-3 py-2 rounded-lg bg-transparent text-white/70 hover:bg-[#D4AF37]/20 hover:text-[#E5C158] transition-colors font-semibold flex items-center gap-2.5 border border-transparent hover:border-[#D4AF37]/30 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l2-9 5 18 5-18 2 9h4"/></svg>
            Ventas y Finanzas
          </Link>
        </nav>

        <div className="p-3 border-t border-white/5">
          <Link href="/" className="w-full px-3 py-2.5 rounded-lg bg-[#090A0F]/50 text-white/70 hover:bg-white/10 transition-colors font-bold flex items-center gap-2 border border-white/10 justify-center text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Ir al POS
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto p-3 pl-0">
        <div className="glass-panel w-full h-full p-6 overflow-y-auto relative rounded-xl">
          {children}
        </div>
      </main>
    </div>
  );
}
