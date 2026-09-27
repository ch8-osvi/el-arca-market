"use client";

import { useState } from "react";
import { addBatch } from "@/actions/batches";

export default function AddBatchForm({ products }: { products: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const productoId = formData.get("productoId") as string;
    const cantidad = parseInt(formData.get("cantidad") as string);
    const costoUnitario = parseFloat(formData.get("costoUnitario") as string);

    if (!productoId || isNaN(cantidad) || isNaN(costoUnitario) || cantidad <= 0) {
      setError("Datos inválidos.");
      setLoading(false);
      return;
    }

    const res = await addBatch({ productoId, cantidad, costoUnitario });
    if (!res.success) {
      setError(res.error || "Ocurrió un error.");
    } else {
      setSuccess("Lote añadido correctamente.");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(""), 3000);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-4 flex flex-col gap-3 h-full rounded-xl">
      <h3 className="font-bold text-sm mb-1">Entrada de Almacén (Nuevo Lote)</h3>
      
      {error && <div className="text-red-400 text-xs">{error}</div>}
      {success && <div className="text-green-400 text-xs">{success}</div>}

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Producto</label>
        <select name="productoId" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 appearance-none text-white transition-colors">
          <option value="">Selecciona un producto</option>
          {products.map(p => (
            <option key={p._id} value={p._id}>{p.nombre}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Cantidad Entrante</label>
        <input name="cantidad" type="number" min="1" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors" placeholder="Ej. 50" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Costo Unitario (CUP)</label>
        <input name="costoUnitario" type="number" step="0.01" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors" placeholder="Costo por unidad de esta compra" />
      </div>

      <button type="submit" disabled={loading} className="mt-auto w-full py-2.5 rounded-lg bg-white/10 text-white font-bold text-sm hover:bg-white/20 disabled:opacity-50 transition-all border border-white/10">
        {loading ? "Registrando..." : "Registrar Lote"}
      </button>
    </form>
  );
}
