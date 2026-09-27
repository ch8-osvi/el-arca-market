"use client";

import { useState } from "react";
import { processSale } from "@/actions/sales";

export default function POSClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [payMethod, setPayMethod] = useState<"Efectivo" | "Pago x Móvil" | "">("Efectivo");
  const [loading, setLoading] = useState(false);

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

    const res = await processSale({ items, metodoPago: payMethod });
    
    if (res.success) {
      alert("Venta procesada con éxito!");
      // Optimistically update stock
      const updatedProducts = products.map(p => {
        const soldItem = cart.find(c => c.product._id === p._id);
        if (soldItem) {
          return { ...p, stockTienda: p.stockTienda - soldItem.cantidad };
        }
        return p;
      });
      setProducts(updatedProducts);
      setCart([]);
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4 relative z-10">
      {/* Left Side: Products Grid */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        {/* Search & Filters */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..." 
              className="w-full bg-[#090A0F]/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            <button onClick={() => setFilterCat("")} className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors whitespace-nowrap ${filterCat === "" ? "bg-[#D4AF37]/20 text-[#E5C158] border-[#D4AF37]/30" : "bg-white/5 text-white/70 border-white/5"}`}>Todos</button>
            {["Aseo", "Confitura", "Básicos", "Bebidas", "Otros"].map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)} className={`px-4 py-2.5 rounded-xl text-sm border transition-colors whitespace-nowrap ${filterCat === cat ? "bg-[#D4AF37]/20 text-[#E5C158] border-[#D4AF37]/30 font-bold" : "bg-white/5 text-white/70 border-white/5"}`}>{cat}</button>
            ))}
          </div>
        </div>
        
        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {filteredProducts.map((p) => (
            <div key={p._id} onClick={() => addToCart(p)} className="bg-white/[0.02] border border-white/5 rounded-2xl p-2 flex flex-col gap-2 hover:border-[#D4AF37]/40 hover:bg-white/[0.04] transition-all cursor-pointer group">
              <div className="h-24 sm:h-28 bg-[#090A0F]/50 rounded-xl flex items-center justify-center border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-white/20 text-3xl group-hover:scale-110 group-hover:text-[#D4AF37]/40 transition-all duration-300">📦</span>
              </div>
              <div className="flex flex-col px-1 pb-1">
                <span className="text-xs font-bold text-white/90 truncate">{p.nombre}</span>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[#E5C158] font-black text-sm tracking-tight">${p.precioVenta}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border ${p.stockTienda > 0 ? "bg-[#090A0F] text-white/50 border-white/10" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                    STOCK: {p.stockTienda}
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

      {/* Right Side: Cart */}
      <div className="w-full md:w-80 lg:w-96 glass-card flex flex-col overflow-hidden h-[400px] md:h-auto shrink-0">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-extrabold text-lg tracking-tight">Orden Actual</h2>
          {cart.length > 0 && (
            <button onClick={() => setCart([])} className="text-white/30 hover:text-white/70 text-sm">Vaciar</button>
          )}
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
           {cart.length === 0 ? (
             <div className="flex items-center justify-center h-full">
               <span className="text-white/30 text-sm font-medium">No hay productos en la orden</span>
             </div>
           ) : (
             cart.map((item, idx) => (
               <div key={idx} className="flex items-center justify-between bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:bg-white/[0.04] transition-colors group">
                 <div className="flex flex-col">
                   <span className="text-sm font-bold text-white/90">{item.product.nombre}</span>
                   <span className="text-xs text-[#E5C158] font-black tracking-tight">${item.product.precioVenta} x {item.cantidad}</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="font-bold text-sm text-white/90">${item.product.precioVenta * item.cantidad}</span>
                   <button onClick={() => removeFromCart(item.product._id)} className="text-red-400/50 group-hover:text-red-400 bg-red-400/5 group-hover:bg-red-400/10 w-6 h-6 rounded-md flex items-center justify-center transition-colors">✕</button>
                 </div>
               </div>
             ))
           )}
        </div>
        
        {/* Cart Footer / Checkout */}
        <div className="p-5 border-t border-white/5 bg-[#090A0F]/60 flex flex-col gap-4 shrink-0">
          <div className="flex justify-between items-center text-2xl font-black">
            <span>Total</span>
            <span className="text-[#E5C158]">${subtotal} CUP</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button 
              onClick={() => setPayMethod("Pago x Móvil")}
              className={`py-2 rounded-xl text-sm font-bold border transition-colors ${payMethod === "Pago x Móvil" ? "bg-[#D4AF37]/20 text-[#E5C158] border-[#D4AF37]/30" : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"}`}
            >
              Pago x Móvil
            </button>
            <button 
              onClick={() => setPayMethod("Efectivo")}
              className={`py-2 rounded-xl text-sm font-bold border transition-colors ${payMethod === "Efectivo" ? "bg-[#D4AF37]/20 text-[#E5C158] border-[#D4AF37]/30" : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"}`}
            >
              Efectivo
            </button>
          </div>
          
          <button 
            disabled={cart.length === 0 || loading}
            onClick={handleCheckout}
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA8826] text-[#090A0F] font-black text-lg hover:opacity-90 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Procesando..." : "Cobrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
