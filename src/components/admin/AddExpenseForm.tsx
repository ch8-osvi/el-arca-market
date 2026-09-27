"use client";

import { useState } from "react";
import { createExpense } from "@/actions/expenses";

export default function AddExpenseForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const concepto = formData.get("concepto") as string;
    const monto = parseFloat(formData.get("monto") as string);

    if (!concepto || isNaN(monto) || monto <= 0) {
      setError("Llena todos los campos correctamente.");
      setLoading(false);
      return;
    }

    const res = await createExpense({ concepto, monto });
    if (!res.success) {
      setError(res.error || "Ocurrió un error.");
    } else {
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-4 flex flex-col gap-3 rounded-xl">
      <h3 className="font-bold text-sm mb-1">Registrar Gasto</h3>
      
      {error && <div className="text-red-400 text-xs">{error}</div>}

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Concepto</label>
        <input name="concepto" type="text" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors" placeholder="Ej. Pago de electricidad" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Monto (CUP)</label>
        <input name="monto" type="number" step="0.01" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors" placeholder="Ej. 1500" />
      </div>

      <button type="submit" disabled={loading} className="mt-2 w-full py-2.5 rounded-lg bg-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/30 disabled:opacity-50 transition-all border border-red-500/20">
        {loading ? "Guardando..." : "Registrar Gasto"}
      </button>
    </form>
  );
}
