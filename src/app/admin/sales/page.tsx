import Link from "next/link";
import connectDB from "@/lib/db";
import { Sale } from "@/models/Sale";
import RefundButton from '@/components/admin/RefundButton';
import MarkPaidButton from '@/components/admin/MarkPaidButton';
import { Expense } from "@/models/Expense";
import ExportCSVButton from "@/components/admin/ExportCSVButton";

export const dynamic = "force-dynamic";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  await connectDB();
  
  const period = searchParams.period || "7"; // default 7 days
  
  let dateQuery: any = {};
  let statusQuery: any = {};
  
  if (period !== "all" && period !== "pendientes") {
    const days = parseInt(period);
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    dateQuery = { fecha: { $gte: dateLimit } };
  }

  if (period === "pendientes") {
    statusQuery = { estado: "Pendiente" };
  }

  // Fetch Sales based on period and status
  const salesRaw = await Sale.find({ ...dateQuery, ...statusQuery }).sort({ fecha: -1 }).populate("items.productoId", "nombre");
  const sales = JSON.parse(JSON.stringify(salesRaw));
  
  // Fetch Expenses based on period
  const expensesRaw = await Expense.find(dateQuery);
  const expenses = JSON.parse(JSON.stringify(expensesRaw));

  // Calculate some basic stats
  let totalGananciaBruta = 0;
  let totalVentas = 0;
  let totalGastos = expenses.reduce((acc: number, curr: any) => acc + curr.monto, 0);
  
  sales.forEach((s: any) => {
    if (s.estadoVenta === "Completada" && s.estado === "Pagado") {
      totalVentas += s.total;
      
      s.items.forEach((item: any) => {
        const gananciaItem = (item.precioVenta * item.cantidad) - item.costoCalculadoDesdeLotes;
        totalGananciaBruta += gananciaItem;
      });
    }
  });

  let totalGananciaNeta = totalGananciaBruta - totalGastos;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto h-full">
      <div className="flex items-center justify-between shrink-0 flex-wrap gap-2">
        <h1 className="text-xl font-black tracking-tight">Historial de Ventas y Finanzas</h1>
        
        <div className="flex gap-4 items-center">
          <ExportCSVButton sales={sales} expenses={expenses} />
          
          <div className="flex gap-2 bg-white/5 p-1 rounded-lg overflow-x-auto">
            <Link href="/admin/sales?period=1" className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${period === "1" ? "bg-[#D4AF37]/20 text-[#E5C158]" : "text-white/50 hover:text-white"}`}>Hoy</Link>
            <Link href="/admin/sales?period=7" className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${period === "7" ? "bg-[#D4AF37]/20 text-[#E5C158]" : "text-white/50 hover:text-white"}`}>7 Días</Link>
            <Link href="/admin/sales?period=30" className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${period === "30" ? "bg-[#D4AF37]/20 text-[#E5C158]" : "text-white/50 hover:text-white"}`}>30 Días</Link>
            <Link href="/admin/sales?period=all" className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${period === "all" ? "bg-[#D4AF37]/20 text-[#E5C158]" : "text-white/50 hover:text-white"}`}>Todo</Link>
            <div className="w-px bg-white/10 mx-1" />
            <Link href="/admin/sales?period=pendientes" className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${period === "pendientes" ? "bg-red-500/20 text-red-400" : "text-white/50 hover:text-white"}`}>Pendientes</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <div className="glass-card p-4 flex flex-col gap-3 rounded-xl">
          <span className="font-bold text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Recaudación (Bruto)</span>
          <div className="text-2xl font-black text-white">
            ${totalVentas.toFixed(2)} <span className="text-xs text-[var(--color-text-muted)] font-bold">CUP</span>
          </div>
        </div>
        <div className="glass-card p-4 flex flex-col gap-3 rounded-xl border-red-500/10">
          <span className="font-bold text-[10px] uppercase tracking-wider text-red-400">Gastos Operativos</span>
          <div className="text-2xl font-black text-red-400">
            ${totalGastos.toFixed(2)} <span className="text-xs text-red-400/50 font-bold">CUP</span>
          </div>
        </div>
        <div className="glass-card p-4 flex flex-col gap-3 border-[#D4AF37]/30 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent pointer-events-none" />
          <span className="font-bold text-[10px] uppercase tracking-wider text-[#E5C158] relative z-10">Ganancia Neta Real</span>
          <div className="text-2xl font-black text-[#E5C158] relative z-10">
            ${totalGananciaNeta.toFixed(2)} <span className="text-xs text-[#E5C158]/50 font-bold">CUP</span>
          </div>
        </div>
      </div>

      <div className="flex-1 glass-card p-4 flex flex-col min-h-0 rounded-xl">
        <h3 className="font-bold text-sm mb-3 shrink-0">Historial Detallado</h3>
        
        <div className="flex-1 overflow-x-auto overflow-y-auto pr-2">
          <table className="w-full text-left border-collapse text-xs min-w-[600px]">
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
                        {s.notas && (
                          <span className="text-[10px] text-[var(--color-text-muted)] italic mt-1 bg-white/5 p-1.5 rounded border border-white/5">
                            Nota: {s.notas}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`text-[9px] border px-1.5 py-0.5 rounded uppercase font-bold ${s.estadoVenta === 'Reembolsada' ? 'border-red-500/20 text-red-400 bg-red-500/10' : s.estado === 'Pendiente' ? 'border-yellow-500/20 text-yellow-400 bg-yellow-500/10' : 'border-white/10 text-white/60'}`}>{s.metodoPago || 'Sin Pago'} {s.estadoVenta === 'Reembolsada' && '(Reembolso)'} {s.estado === 'Pendiente' && '(Pendiente)'}</span>
                        {s.estadoVenta !== 'Reembolsada' && <RefundButton saleId={s._id.toString()} />}
                        {s.estado === 'Pendiente' && s.estadoVenta !== 'Reembolsada' && <MarkPaidButton saleId={s._id.toString()} />}
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
