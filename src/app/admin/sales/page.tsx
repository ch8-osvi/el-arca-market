import connectDB from "@/lib/db";
import { Sale } from "@/models/Sale";
import RefundButton from "@/components/RefundButton";
import { Expense } from "@/models/Expense";

export const dynamic = "force-dynamic";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  await connectDB();
  
  const period = searchParams.period || "7"; // default 7 days
  
  let dateQuery = {};
  if (period !== "all") {
    const days = parseInt(period);
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    dateQuery = { fecha: { $gte: dateLimit } };
  }

  // Fetch Sales based on period
  const salesRaw = await Sale.find(dateQuery).sort({ fecha: -1 }).populate("items.productoId", "nombre");
  const sales = JSON.parse(JSON.stringify(salesRaw));

  // Calculate some basic stats
  let totalGanancia = 0;
  let totalVentas = 0;
  
  sales.forEach((s: any) => {
    if (s.estadoVenta === "Completada") {
      totalVentas += s.total;
      
      s.items.forEach((item: any) => {
        const gananciaItem = (item.precioVenta * item.cantidad) - item.costoCalculadoDesdeLotes;
        totalGanancia += gananciaItem;
      });
    }
  });

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto h-full">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-xl font-black tracking-tight">Historial de Ventas y Finanzas</h1>
        
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
          <a href="/admin/sales?period=1" className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${period === "1" ? "bg-[#D4AF37]/20 text-[#E5C158]" : "text-white/50 hover:text-white"}`}>Hoy</a>
          <a href="/admin/sales?period=7" className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${period === "7" ? "bg-[#D4AF37]/20 text-[#E5C158]" : "text-white/50 hover:text-white"}`}>7 Días</a>
          <a href="/admin/sales?period=30" className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${period === "30" ? "bg-[#D4AF37]/20 text-[#E5C158]" : "text-white/50 hover:text-white"}`}>30 Días</a>
          <a href="/admin/sales?period=all" className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${period === "all" ? "bg-[#D4AF37]/20 text-[#E5C158]" : "text-white/50 hover:text-white"}`}>Todo</a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
        <div className="glass-card p-4 flex flex-col gap-3 rounded-xl">
          <span className="font-bold text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Recaudación (Bruto)</span>
          <div className="text-2xl font-black text-white">
            ${totalVentas.toFixed(2)} <span className="text-xs text-[var(--color-text-muted)] font-bold">CUP</span>
          </div>
        </div>
        <div className="glass-card p-4 flex flex-col gap-3 border-[#D4AF37]/30 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent pointer-events-none" />
          <span className="font-bold text-[10px] uppercase tracking-wider text-[#E5C158] relative z-10">Ganancia Neta (Lotes FIFO)</span>
          <div className="text-2xl font-black text-[#E5C158] relative z-10">
            ${totalGanancia.toFixed(2)} <span className="text-xs text-[#E5C158]/50 font-bold">CUP</span>
          </div>
        </div>
      </div>

      <div className="flex-1 glass-card p-4 flex flex-col min-h-0 rounded-xl">
        <h3 className="font-bold text-sm mb-3 shrink-0">Historial Detallado</h3>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-[var(--color-text-muted)]">
                <th className="pb-2 font-bold">Fecha</th>
                <th className="pb-2 font-bold">Detalle (Cant x Prod)</th>
                <th className="pb-2 font-bold">Pago</th>
                <th className="pb-2 font-bold text-right">Costo Estimado</th>
                <th className="pb-2 font-bold text-right">Total Cobrado</th>
                <th className="pb-2 font-bold text-right">Ganancia</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s: any) => {
                const date = new Date(s.fecha).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
                const costoTotal = s.items.reduce((acc: number, item: any) => acc + item.costoCalculadoDesdeLotes, 0);
                const ganancia = s.total - costoTotal;
                
                return (
                  <tr key={s._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2.5 text-white/70">{date}</td>
                    <td className="py-2.5">
                      <div className="flex flex-col gap-0.5">
                        {s.items.map((item: any, idx: number) => (
                          <span key={idx} className="text-white/90">
                            {item.cantidad}x {item.productoId?.nombre || "Producto Borrado"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`text-[9px] border px-1.5 py-0.5 rounded uppercase font-bold ${s.estadoVenta === 'Reembolsada' ? 'border-red-500/20 text-red-400 bg-red-500/10' : 'border-white/10 text-white/60'}`}>{s.metodoPago} {s.estadoVenta === 'Reembolsada' && '(Reembolso)'}</span>
                        {s.estadoVenta !== 'Reembolsada' && <RefundButton saleId={s._id.toString()} />}
                      </div>
                    </td>
                    <td className="py-2.5 text-right text-white/50">${costoTotal.toFixed(2)}</td>
                    <td className="py-2.5 text-right font-bold text-sm">${s.total.toFixed(2)}</td>
                    <td className="py-2.5 text-right font-bold text-[#E5C158] text-sm">+${ganancia.toFixed(2)}</td>
                  </tr>
                );
              })}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-white/30 text-xs">No hay ventas registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
