import { getProducts, getBatches } from "@/actions/inventory";
import AddBatchForm from '@/components/admin/AddBatchForm';
import TransferStockForm from '@/components/admin/TransferStockForm';

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const [resProducts, resBatches] = await Promise.all([getProducts(), getBatches()]);
  const products = resProducts.success ? resProducts.products : [];
  const batches = resBatches.success ? resBatches.batches : [];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto h-full">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tight">Gestión de Almacén</h1>
          <p className="text-[var(--color-text-muted)] text-xs mt-0.5">Registra entradas (Lotes FIFO) y transfiere stock a la tienda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
        <AddBatchForm products={products} />
        <TransferStockForm products={products} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[300px]">
        {/* Resumen de Inventario */}
        <div className="glass-card p-4 flex flex-col min-h-0 rounded-xl">
          <h3 className="font-bold text-sm mb-3 shrink-0">Resumen de Inventario</h3>
          <div className="flex-1 overflow-x-auto overflow-y-auto pr-2">
            <table className="w-full text-left border-collapse text-sm min-w-[400px]">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
                  <th className="pb-2 font-bold">Producto</th>
                  <th className="pb-2 font-bold text-right">Almacén</th>
                  <th className="pb-2 font-bold text-right">Tienda</th>
                  <th className="pb-2 font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2.5 flex flex-col">
                      <span className="font-bold text-white/90">{p.nombre}</span>
                      <span className="text-[9px] uppercase text-[#E5C158] font-bold tracking-wider">{p.categoria}</span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-[#8E94A5]">{p.stockAlmacen}</td>
                    <td className="py-2.5 text-right font-bold text-white">{p.stockTienda}</td>
                    <td className="py-2.5 text-right font-bold">{(p.stockAlmacen + p.stockTienda) || 0}</td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-white/30 text-xs">No hay productos registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Historial de Lotes */}
        <div className="glass-card p-4 flex flex-col min-h-0 rounded-xl">
          <h3 className="font-bold text-sm mb-3 shrink-0">Historial de Lotes</h3>
          <div className="flex-1 overflow-x-auto overflow-y-auto pr-2">
            <table className="w-full text-left border-collapse text-xs min-w-[400px]">
              <thead>
                <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-[var(--color-text-muted)]">
                  <th className="pb-2 font-bold">Fecha / ID</th>
                  <th className="pb-2 font-bold">Producto</th>
                  <th className="pb-2 font-bold text-right">Cant.</th>
                  <th className="pb-2 font-bold text-right">Costo</th>
                  <th className="pb-2 font-bold text-right">Restante</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b: any) => {
                  const date = new Date(b.fechaEntrada).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                  return (
                    <tr key={b._id} className={`border-b border-white/5 transition-colors ${b.cantidadRestante === 0 ? "opacity-50" : "hover:bg-white/5"}`}>
                      <td className="py-2.5 flex flex-col">
                        <span className="text-white/70">{date}</span>
                        <span className="text-[9px] text-[var(--color-text-muted)] font-mono">{b._id.toString().slice(-6)}</span>
                      </td>
                      <td className="py-2.5 font-bold text-white/90">{b.productoId?.nombre || "Desconocido"}</td>
                      <td className="py-2.5 text-right text-white/80">+{b.cantidadInicial}</td>
                      <td className="py-2.5 text-right text-[#E5C158] font-bold">${b.costoUnitario}</td>
                      <td className="py-2.5 text-right font-black">
                        {b.cantidadRestante}
                      </td>
                    </tr>
                  )
                })}
                {batches.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-white/30 text-xs">No hay lotes registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
