import Link from "next/link";
import { getProducts } from "@/actions/inventory";
import POSClient from '@/components/pos/POSClient';

export const dynamic = "force-dynamic";

export default async function POSPage() {
  const res = await getProducts();
  const products = res.success ? res.products : [];

  return (
    <main className="flex h-screen flex-col overflow-hidden relative">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37] opacity-[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-[#D4AF37] opacity-[0.02] blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <header className="glass-panel mx-3 mt-3 px-4 py-2.5 flex items-center justify-between shrink-0 relative z-10 rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E5C158] to-[#AA8826] flex items-center justify-center text-[#090A0F] font-extrabold text-lg shadow-[0_0_10px_rgba(212,175,55,0.3)]">
            A
          </div>
          <h1 className="text-lg font-black tracking-tight">
            EL ARCA <span className="gold-gradient-text">MARKET</span>
          </h1>
        </div>
        <nav>
          <Link 
            href="/admin" 
            className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[#E5C158] transition-colors flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            Admin Panel
          </Link>
        </nav>
      </header>

      {/* POS Interactive Client Area */}
      <POSClient initialProducts={products} />
      
    </main>
  );
}
