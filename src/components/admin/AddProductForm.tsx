"use client";

import { useState } from "react";
import { createProduct } from "@/actions/inventory";

export default function AddProductForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre") as string;
    const categoria = formData.get("categoria") as string;
    const precioVenta = parseFloat(formData.get("precioVenta") as string);
    const imagenUrl = formData.get("imagenUrl") as string;
    const cantidadInicial = parseInt(formData.get("cantidadInicial") as string);
    const costoReferencia = parseFloat(formData.get("costoReferencia") as string);

    if (!nombre || !categoria || isNaN(precioVenta)) {
      setError("Por favor, llena todos los campos obligatorios correctamente.");
      setLoading(false);
      return;
    }

    const res = await createProduct({ 
      nombre, 
      categoria, 
      precioVenta, 
      imagenUrl,
      cantidadInicial: isNaN(cantidadInicial) ? 0 : cantidadInicial,
      costoReferencia: isNaN(costoReferencia) ? 0 : costoReferencia
    });
    
    if (!res.success) {
      setError(res.error || "Ocurrió un error.");
    } else {
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-4 flex flex-col gap-3 rounded-xl overflow-y-auto max-h-[80vh]">
      <h3 className="font-bold text-sm mb-1">Añadir Nuevo Producto</h3>
      
      {error && <div className="text-red-400 text-xs">{error}</div>}

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Nombre *</label>
        <input name="nombre" type="text" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors" placeholder="Ej. Jugo de Naranja" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Categoría *</label>
        <select name="categoria" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 appearance-none text-white transition-colors">
          <option value="Aseo">Aseo</option>
          <option value="Confitura">Confitura</option>
          <option value="Básicos">Básicos</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Precio de Venta (CUP) *</label>
        <input name="precioVenta" type="number" step="0.01" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors" placeholder="Ej. 300" />
      </div>

      <div className="h-px bg-white/5 my-1" />

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[#E5C158] uppercase tracking-wider">Stock Inicial (Opcional)</label>
        <input name="cantidadInicial" type="number" min="0" className="bg-[#090A0F]/50 border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors" placeholder="Cantidad que entra al almacén" />
      </div>
      
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[#E5C158] uppercase tracking-wider">Costo Inicial (CUP)</label>
        <input name="costoReferencia" type="number" step="0.01" className="bg-[#090A0F]/50 border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors" placeholder="Costo por unidad de este lote" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">URL de Imagen (Opcional)</label>
        <input name="imagenUrl" type="url" className="bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors text-white/50" placeholder="https://ejemplo.com/foto.jpg" />
      </div>

      <button type="submit" disabled={loading} className="mt-2 w-full py-2.5 rounded-lg bg-[#D4AF37] text-[#090A0F] font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all">
        {loading ? "Guardando..." : "Crear Producto"}
      </button>
    </form>
  );
}
