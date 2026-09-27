"use client";

import { useState } from "react";
import { processSale } from "@/actions/sales";

export default function POSClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [payMethod, setPayMethod] = useState<"Efectivo" | "Pago x Móvil" | "">("Efectivo");
  const [saleStatus, setSaleStatus] = useState<"Pagado" | "Pendiente">("Pagado");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCat ? p.categoria === filterCat : true;
    return matchesSearch && matchesCat;
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.product.precioVenta * item.cantidad), 0);

  const addToCart = (product: any) => {
    if (product.stockTienda <= 0) {
      alert("No hay stock en tienda para este producto.");
      return;
    }
    const existing = cart.find(i => i.product._id === product._id);
    if (existing) {
      if (existing.cantidad >= product.stockTienda) {
        alert("No puedes añadir más cantidad de la que hay en tienda.");
        return;
      }
      setCart(cart.map(i => i.product._id === product._id ? { ...i, cantidad: i.cantidad + 1 } : i));
    } else {
      setCart([...cart, { product, cantidad: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(i => i.product._id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);

    const items = cart.map(i => ({
      productoId: i.product._id,
      cantidad: i.cantidad,
      precioVenta: i.product.precioVenta
    }));

    const res = await processSale({ items, metodoPago: payMethod, estado: saleStatus, notas });

    if (res.success) {
      setSuccessMsg(saleStatus === "Pendiente" ? "Orden pendiente guardada." : "Venta procesada con éxito!");
      const updatedProducts = products.map(p => {
        const soldItem = cart.find(c => c.product._id === p._id);
        if (soldItem) return { ...p, stockTienda: p.stockTienda - soldItem.cantidad };
        return p;
      });
      setProducts(updatedProducts);
      setCart([]);
      setNotas("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  };

  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex-1 flex overflow-hidden p-3 gap-3 relative z-10">
      {/* Left Side: Products Grid */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden rounded-xl">
        {/* Search & Filters */}
        <div className="p-3 border-b border-white/5 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full bg-[#090A0F]/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-hide">
            <button onClick={() => setFilterCat("")} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${filterCat === "" ? "bg-[#D4AF37]/20 text-[#E5C158] border-[#D4AF37]/30" : "bg-white/5 text-white/60 border-white/5"}`}>Todos</button>
            {["Aseo", "Confitura", "Básicos", "Bebidas", "Otros"].map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1.5 rounded-lg text-xs border transition-colors whitespace-nowrap ${filterCat === cat ? "bg-[#D4AF37]/20 text-[#E5C158] border-[#D4AF37]/30 font-bold" : "bg-white/5 text-white/60 border-white/5"}`}>{cat}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 pb-20 md:pb-3">
          {filteredProducts.map((p) => (
            <div key={p._id} onClick={() => p.stockTienda > 0 && addToCart(p)} className={`bg-white/[0.02] border rounded-xl p-2 flex flex-col gap-2 transition-all cursor-pointer group ${p.stockTienda === 0 ? "border-red-500/10 opacity-50 cursor-not-allowed pointer-events-none" : "border-white/5 hover:border-[#D4AF37]/40 hover:bg-white/[0.04]"}`}>
              <div className="h-20 bg-[#090A0F]/50 rounded-lg flex items-center justify-center border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                {p.imagenUrl ? (
                  <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                ) : (
                  <span className="text-white/20 text-2xl group-hover:scale-110 group-hover:text-[#D4AF37]/40 transition-all duration-300 relative z-10">📦</span>
                )}
                {p.stockTienda === 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                    <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Agotado</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col px-0.5">
                <span className="text-xs font-bold text-white/90 truncate">{p.nombre}</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[#E5C158] font-black text-sm tracking-tight">${p.precioVenta}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border ${p.stockTienda > 0 ? "bg-[#090A0F] text-white/50 border-white/10" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                    {p.stockTienda}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full flex items-center justify-center text-white/30 p-10 text-sm">No se encontraron productos.</div>
          )}
        </div>
      </div>

      {/* Mobile Cart Toggle Button */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <button 
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="w-full glass-card border-[#D4AF37]/50 bg-[#090A0F]/90 backdrop-blur-md text-[#E5C158] font-black py-4 rounded-2xl flex items-center justify-between px-6 shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
        >
          <div className="flex items-center gap-3">
            <span className="bg-[#D4AF37] text-[#090A0F] w-6 h-6 rounded-full flex items-center justify-center text-xs">
              {cart.reduce((sum, i) => sum + i.cantidad, 0)}
            </span>
            <span>Ver Orden</span>
          </div>
          <span>${subtotal} CUP</span>
        </button>
      </div>

      {/* Cart Overlay (Mobile) */}
      {isCartOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      )}

      {/* Right Side: Cart */}
      <div className={`fixed inset-x-0 bottom-0 top-20 z-50 transition-transform duration-300 md:relative md:inset-auto md:w-72 lg:w-80 md:translate-y-0 ${isCartOpen ? "translate-y-0" : "translate-y-[120%]"} glass-card flex flex-col overflow-hidden shrink-0 rounded-t-3xl md:rounded-xl border-t border-[#D4AF37]/20 md:border-white/10 bg-[#090A0F] md:bg-transparent`}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-base tracking-tight">Orden Actual</h2>
            {cart.length > 0 && <span className="text-[#D4AF37] text-xs font-bold">({cart.length})</span>}
          </div>
          <div className="flex items-center gap-4">
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-white/30 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-wider">Vaciar</button>
            )}
            <button onClick={() => setIsCartOpen(false)} className="md:hidden text-white/50 bg-white/5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10">✕</button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {cart.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-white/30 text-sm font-medium">No hay productos en la orden</span>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white/[0.02] p-2.5 rounded-xl border border-white/5 hover:bg-white/[0.04] transition-colors group">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white/90">{item.product.nombre}</span>
                  <span className="text-xs text-[#E5C158] font-black tracking-tight">${item.product.precioVenta} x {item.cantidad}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white/90">${item.product.precioVenta * item.cantidad}</span>
                  <button onClick={() => removeFromCart(item.product._id)} className="text-red-400/50 group-hover:text-red-400 bg-red-400/5 group-hover:bg-red-400/10 w-5 h-5 rounded flex items-center justify-center transition-colors text-xs">✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer / Checkout */}
        <div className="p-4 border-t border-white/5 bg-gradient-to-t from-[#090A0F] to-[#090A0F]/80 flex flex-col gap-3 shrink-0 backdrop-blur-xl">
          {/* Total */}
          <div className="flex justify-between items-center mb-1">
            <span className="text-base font-black">Total a Pagar</span>
            <span className="text-[#E5C158] font-black text-2xl">${subtotal} <span className="text-xs text-[#E5C158]/60 font-bold">CUP</span></span>
          </div>

          <div className="flex gap-2">
            {/* Estado: Pagado / Pendiente */}
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider text-center">Estado</span>
              <div className="grid grid-cols-2 gap-1 bg-[#090A0F]/50 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setSaleStatus("Pagado")}
                  className={`py-2 rounded-lg text-[10px] font-black uppercase transition-colors ${saleStatus === "Pagado" ? "bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/10" : "text-white/50 hover:bg-white/5"}`}
                >
                  PAGADO
                </button>
                <button
                  onClick={() => setSaleStatus("Pendiente")}
                  className={`py-2 rounded-lg text-[10px] font-black uppercase transition-colors ${saleStatus === "Pendiente" ? "bg-amber-500/20 text-amber-400 shadow-sm shadow-amber-500/10" : "text-white/50 hover:bg-white/5"}`}
                >
                  PENDIENTE
                </button>
              </div>
            </div>

            {/* Método de Pago */}
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider text-center">Método</span>
              <div className="grid grid-cols-2 gap-1 bg-[#090A0F]/50 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setPayMethod("Efectivo")}
                  className={`py-2 rounded-lg text-[10px] font-black uppercase transition-colors ${payMethod === "Efectivo" ? "bg-[#D4AF37]/20 text-[#E5C158] shadow-sm shadow-[#D4AF37]/10" : "text-white/50 hover:bg-white/5"}`}
                >
                  EFECTIVO
                </button>
                <button
                  onClick={() => setPayMethod("Pago x Móvil")}
                  className={`py-2 rounded-lg text-[10px] font-black uppercase transition-colors ${payMethod === "Pago x Móvil" ? "bg-[#D4AF37]/20 text-[#E5C158] shadow-sm shadow-[#D4AF37]/10" : "text-white/50 hover:bg-white/5"}`}
                >
                  MÓVIL
                </button>
              </div>
            </div>
          </div>

          {/* Notas */}
          <input
            type="text"
            value={notas}
            onChange={e => setNotas(e.target.value)}
            placeholder="Nota opcional..."
            className="bg-[#090A0F]/50 border border-white/10 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#D4AF37]/50 transition-colors text-white/80 placeholder:text-white/20 mt-1"
          />

          {/* Success message */}
          {successMsg && (
            <div className="text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-2">
              {successMsg}
            </div>
          )}

          <button
            disabled={cart.length === 0 || loading}
            onClick={handleCheckout}
            className={`w-full py-4 mt-1 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 ${saleStatus === "Pendiente" ? "bg-gradient-to-r from-amber-500 to-amber-700 text-[#090A0F]" : "bg-gradient-to-r from-[#D4AF37] to-[#AA8826] text-[#090A0F]"}`}
          >
            {loading ? "Procesando..." : saleStatus === "Pendiente" ? "Guardar Deuda" : "Completar Cobro"}
          </button>
        </div>
      </div>
    </div>
  );
}
