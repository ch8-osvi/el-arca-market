import connectDB from "@/lib/db";
import { Sale } from "@/models/Sale";
import { Product } from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectDB();
  
  // Get today's start and end date for filtering
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Fetch today's sales
  const salesToday = await Sale.find({
    fecha: { $gte: today, $lt: tomorrow },
    estadoVenta: "Completada"
  }).populate("items.productoId", "nombre");

  let ventasHoy = 0;
  let gananciaHoy = 0;

  salesToday.forEach((s: any) => {
    ventasHoy += s.total;
    s.items.forEach((item: any) => {
      gananciaHoy += (item.precioVenta * item.cantidad) - item.costoCalculadoDesdeLotes;
    });
  });

  // Fetch low stock items (stockTienda < 5)
  const lowStockProductsRaw = await Product.find({ stockTienda: { $lt: 5 } }).limit(5);
  const lowStockProducts = JSON.parse(JSON.stringify(lowStockProductsRaw));

  // Top products calculation from today's sales
  const productSalesCount: Record<string, { name: string, count: number }> = {};
  salesToday.forEach((s: any) => {
    s.items.forEach((item: any) => {
      const pid = item.productoId?._id?.toString();
      const pName = item.productoId?.nombre || "Borrado";
      if (pid) {
        if (!productSalesCount[pid]) productSalesCount[pid] = { name: pName, count: 0 };
        productSalesCount[pid].count += item.cantidad;
      }
    });
  });
  const topProducts = Object.values(productSalesCount).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight">Resumen del Día</h1>
        <div className="text-[10px] font-bold uppercase tracking-widest bg-[#D4AF37]/10 text-[#E5C158] border border-[#D4AF37]/20 px-3 py-1.5 rounded-md">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="glass-card p-4 flex flex-col gap-3 rounded-xl">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l2-9 5 18 5-18 2 9h4"/></svg>
            <span className="font-bold text-[10px] uppercase tracking-wider">Ventas Netas (Hoy)</span>
          </div>
          <div className="text-2xl font-black text-white">
            ${ventasHoy.toFixed(2)} <span className="text-xs text-[var(--color-text-muted)] font-bold">CUP</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-4 flex flex-col gap-3 border-[#D4AF37]/30 relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-2 text-[#E5C158]">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span className="font-bold text-[10px] uppercase tracking-wider">Ganancias Estimadas</span>
          </div>
          <div className="text-2xl font-black text-[#E5C158]">
            ${gananciaHoy.toFixed(2)} <span className="text-xs text-[#E5C158]/50 font-bold">CUP</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-4 flex flex-col gap-3 rounded-xl">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            <span className="font-bold text-[10px] uppercase tracking-wider">Stock Bajo (Tienda)</span>
          </div>
          <div className="text-2xl font-black text-white">
            {lowStockProducts.length} <span className="text-xs text-[var(--color-text-muted)] font-bold">Prod.</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[350px]">
        {/* Recents Sales */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
          <h3 className="font-bold text-sm">Productos Más Vendidos Hoy</h3>
          <div className="flex-1 overflow-y-auto">
            {topProducts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/30 text-xs">Sin ventas registradas hoy.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {topProducts.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs bg-white/5 p-2 rounded-lg">
                    <span className="font-bold text-white/90">{p.name}</span>
                    <span className="text-[#E5C158] font-bold">{p.count} vendidos</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
          <h3 className="font-bold text-sm">Alertas de Stock Bajo (&lt;5 en Tienda)</h3>
          <div className="flex-1 overflow-y-auto">
            {lowStockProducts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/30 text-xs">Todo el inventario de tienda está sano.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {lowStockProducts.map((p: any) => (
                  <div key={p._id} className="flex justify-between items-center text-xs bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
                    <span className="font-bold text-red-200">{p.nombre}</span>
                    <span className="text-red-400 font-bold text-[10px]">Quedan: {p.stockTienda}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
