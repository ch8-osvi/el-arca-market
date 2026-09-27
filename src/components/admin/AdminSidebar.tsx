"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLink from '@/components/admin/NavLink';
import LogoutButton from '@/components/admin/LogoutButton';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
      exact: true,
    },
    {
      href: "/admin/inventory",
      label: "Almacén y Lotes",
      icon: <><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></>,
    },
    {
      href: "/admin/products",
      label: "Catálogo",
      icon: <><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></>,
    },
    {
      href: "/admin/sales",
      label: "Ventas y Finanzas",
      icon: <path d="M2 12h4l2-9 5 18 5-18 2 9h4" />,
    },
    {
      href: "/admin/expenses",
      label: "Gastos",
      icon: <><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    },
  ];

  return (
    <>
      {/* Mobile Header & Hamburger */}
      <div className="md:hidden flex items-center justify-between p-4 glass-panel m-3 mb-0 rounded-xl">
        <h2 className="font-black tracking-tight">El Arca <span className="gold-gradient-text">Market</span></h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-[#D4AF37] p-2 bg-white/5 rounded-lg border border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></> : <><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></>}
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 w-64 md:w-56 glass-card m-3 h-[calc(100vh-24px)] flex flex-col overflow-hidden shrink-0 border-white/10 rounded-xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-[120%] md:translate-x-0"}`}>
        <div className="p-4 border-b border-white/5 flex flex-col gap-0.5">
          <h2 className="text-lg font-black tracking-tight">
            El Arca <span className="gold-gradient-text">Market</span>
          </h2>
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.25em] font-bold">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map(link => (
            <div key={link.href} onClick={() => setIsOpen(false)}>
              <NavLink href={link.href} exact={link.exact}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {link.icon}
                </svg>
                {link.label}
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5 flex flex-col gap-2">
          <Link href="/" className="w-full px-3 py-2 rounded-lg bg-[#090A0F]/50 text-white/60 hover:bg-white/10 transition-colors font-bold flex items-center gap-2 border border-white/10 justify-center text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Ir al POS
          </Link>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
