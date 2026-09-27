"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Error al iniciar sesión");
        setPassword("");
      }
    } catch (err) {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[var(--color-obsidian)] flex items-center justify-center font-sans relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#D4AF37] opacity-[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#D4AF37] opacity-[0.02] blur-[100px] pointer-events-none" />

      <div className="glass-card p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-6 rounded-2xl relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5C158] to-[#AA8826] flex items-center justify-center text-[#090A0F] font-extrabold text-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            A
          </div>
          <div className="text-center">
            <h1 className="text-xl font-black tracking-tight mt-0.5">
              El Arca <span className="gold-gradient-text">Market</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)] font-bold mt-1">Admin Panel</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Contraseña de Acceso</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full bg-[#090A0F]/60 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors text-center tracking-widest text-white"
            />
            {error && (
              <p className="text-red-400 text-xs text-center font-bold mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8826] text-[#090A0F] font-black text-sm hover:opacity-90 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Acceder al Panel"}
          </button>
        </form>

        <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">
          ← Volver al POS
        </Link>
      </div>
    </div>
  );
}
