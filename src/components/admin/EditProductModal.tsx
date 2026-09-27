"use client";

import { useState } from "react";
import { editProduct } from "@/actions/inventory";

export default function EditProductModal({ product, onClose }: { product: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre") as string;
    const categoria = formData.get("categoria") as string;
    const precioVenta = parseFloat(formData.get("precioVenta") as string);
    const imagenUrl = formData.get("imagenUrl") as string;

    if (!nombre || !categoria || isNaN(precioVenta)) {
      setError("Llena todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    const res = await editProduct(product._id, { nombre, categoria, precioVenta, imagenUrl });
    
    if (res.success) {
      onClose();
    } else {
      setError(res.error || "Ocurrió un error.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-sm p-5 rounded-2xl flex flex-col gap-4 border border-white/10 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h3 className="font-black text-lg text-white">Editar Producto</h3>

        {error && <div className="text-red-400 text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Nombre</label>
            <input name="nombre" defaultValue={product.nombre} type="text" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Categoría</label>
            <select name="categoria" defaultValue={product.categoria} className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 appearance-none text-white transition-colors">
              <option value="Aseo">Aseo</option>
              <option value="Confitura">Confitura</option>
              <option value="Básicos">Básicos</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Precio de Venta (CUP)</label>
            <input name="precioVenta" defaultValue={product.precioVenta} type="number" step="0.01" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">URL de Imagen</label>
            <input name="imagenUrl" defaultValue={product.imagenUrl} type="url" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors" />
          </div>

          <button type="submit" disabled={loading} className="mt-2 w-full py-2.5 rounded-lg bg-[#D4AF37] text-[#090A0F] font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
