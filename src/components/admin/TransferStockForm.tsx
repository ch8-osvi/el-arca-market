"use client";

import { useState } from "react";
import { transferToTienda } from "@/actions/batches";

export default function TransferStockForm({ products }: { products: any[] }) {
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

    if (!productoId || isNaN(cantidad) || cantidad <= 0) {
      setError("Datos inválidos.");
      setLoading(false);
      return;
    }

    const res = await transferToTienda({ productoId, cantidad });
    if (!res.success) {
      setError(res.error || "Ocurrió un error.");
    } else {
      setSuccess("Stock transferido a tienda.");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(""), 3000);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-4 flex flex-col gap-3 h-full rounded-xl">
      <h3 className="font-bold text-sm mb-1">Transferir a Tienda</h3>
      
      {error && <div className="text-red-400 text-xs">{error}</div>}
      {success && <div className="text-green-400 text-xs">{success}</div>}

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Producto en Almacén</label>
        <select name="productoId" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 appearance-none text-white transition-colors">
          <option value="">Selecciona producto con stock</option>
          {products.filter(p => p.stockAlmacen > 0).map(p => (
            <option key={p._id} value={p._id}>{p.nombre} (Disp: {p.stockAlmacen})</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Cantidad a Mover</label>
        <input name="cantidad" type="number" min="1" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors" placeholder="Ej. 10" />
      </div>

      <button type="submit" disabled={loading} className="mt-auto w-full py-2.5 rounded-lg bg-[#D4AF37] text-[#090A0F] font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all">
        {loading ? "Transfiriendo..." : "Mover a Tienda"}
      </button>
    </form>
  );
}
