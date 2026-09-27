"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const ADMIN_PASSWORD = "arca2026";
const SESSION_KEY = "arca_admin_auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === "ok") {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "ok");
      setAuthenticated(true);
      setError("");
    } else {
      setError("Contraseña incorrecta");
      setPassword("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  if (loading) return null;

  // Password Gate
  if (!authenticated) {
    return (
      <div className="h-screen bg-[var(--color-obsidian)] flex items-center justify-center font-sans relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#D4AF37] opacity-[0.03] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37] opacity-[0.02] blur-[100px] pointer-events-none" />

        <div className="glass-card p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-6 rounded-2xl relative">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5C158] to-[#AA8826] flex items-center justify-center text-[#090A0F] font-extrabold text-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              A
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)] font-bold">El Arca Market</p>
              <h1 className="text-xl font-black tracking-tight mt-0.5">
                Admin <span className="gold-gradient-text">Panel</span>
              </h1>
            </div>
          </div>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Contraseña de Acceso</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña..."
                autoFocus
                className="w-full bg-[#090A0F]/60 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors text-center tracking-widest"
              />
              {error && (
                <p className="text-red-400 text-xs text-center font-bold">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8826] text-[#090A0F] font-black text-sm hover:opacity-90 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            >
              Acceder al Panel
            </button>
          </form>

          <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            ← Volver al POS
          </Link>
        </div>
      </div>
    );
  }

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
  ];

  return (
    <div className="flex h-screen bg-[var(--color-obsidian)] overflow-hidden font-sans text-sm">
      {/* Admin Sidebar */}
      <aside className="w-56 glass-card m-3 flex flex-col overflow-hidden shrink-0 border-white/10 rounded-xl">
        {/* Header: El Arca Market grande gold, ADMIN PANEL subtítulo muted */}
        <div className="p-4 border-b border-white/5 flex flex-col gap-0.5">
          <h2 className="text-lg font-black tracking-tight">
            El Arca <span className="gold-gradient-text">Market</span>
          </h2>
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.25em] font-bold">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map(link => {
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg transition-colors font-semibold flex items-center gap-2.5 border text-xs ${
                  isActive
                    ? "bg-[#D4AF37]/20 text-[#E5C158] border-[#D4AF37]/30"
                    : "bg-transparent text-white/70 hover:bg-[#D4AF37]/10 hover:text-[#E5C158] border-transparent hover:border-[#D4AF37]/20"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {link.icon}
                </svg>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5 flex flex-col gap-2">
          <Link href="/" className="w-full px-3 py-2 rounded-lg bg-[#090A0F]/50 text-white/60 hover:bg-white/10 transition-colors font-bold flex items-center gap-2 border border-white/10 justify-center text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Ir al POS
          </Link>
          <button onClick={handleLogout} className="w-full px-3 py-2 rounded-lg bg-transparent text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors font-bold flex items-center gap-2 border border-transparent justify-center text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Cerrar Sesión
          </button>
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
