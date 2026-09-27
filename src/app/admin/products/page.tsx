import { getProducts } from "@/actions/inventory";
import AddProductForm from "@/components/AddProductForm";
import ProductDeleteButton from "@/components/ProductDeleteButton";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const res = await getProducts();
  let products = res.success ? res.products : [];

  const tab = searchParams.tab || "todos";

  if (tab === "agotados") {
    products = products.filter((p: any) => p.stockTienda === 0 && p.stockAlmacen === 0);
  } else if (tab === "con-stock") {
    products = products.filter((p: any) => p.stockTienda > 0 || p.stockAlmacen > 0);
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto h-full">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-xl font-black tracking-tight">Catálogo de Productos</h1>
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
          <a href="/admin/products?tab=todos" className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${tab === "todos" ? "bg-[#D4AF37]/20 text-[#E5C158]" : "text-white/50 hover:text-white"}`}>Todos</a>
          <a href="/admin/products?tab=con-stock" className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${tab === "con-stock" ? "bg-[#D4AF37]/20 text-[#E5C158]" : "text-white/50 hover:text-white"}`}>Con Stock</a>
          <a href="/admin/products?tab=agotados" className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${tab === "agotados" ? "bg-red-500/20 text-red-400" : "text-white/50 hover:text-white"}`}>Agotados</a>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* Form to add */}
        <div className="w-full lg:w-72 shrink-0">
          <AddProductForm />
        </div>

        {/* Product List */}
        <div className="flex-1 glass-card p-4 flex flex-col overflow-hidden rounded-xl">
          <h3 className="font-bold text-sm mb-3 shrink-0">
            {tab === "agotados" ? "Productos Agotados (Reordenar)" : "Productos Registrados"}
          </h3>

          
          <div className="flex-1 overflow-y-auto pr-2">
            {products.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[var(--color-text-muted)] text-sm">
                No hay productos en el catálogo.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {products.map((p: any) => (
                  <div key={p._id} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col gap-2 hover:border-[#D4AF37]/30 hover:bg-white/[0.04] transition-colors relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <ProductDeleteButton productId={p._id} productName={p.nombre} />                    
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex flex-col max-w-[70%]">
                        <span className="font-bold text-sm text-white/90 truncate">{p.nombre}</span>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-[var(--color-text-muted)]">{p.categoria}</span>
                      </div>
                      <span className="font-black text-[#E5C158] text-sm">${p.precioVenta} CUP</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-1 pt-2 border-t border-white/5 relative z-10">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase text-white/40 font-bold tracking-wider">Tienda</span>
                        <span className="font-bold text-xs">{p.stockTienda}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase text-white/40 font-bold tracking-wider">Almacén</span>
                        <span className="font-bold text-xs text-[#8E94A5]">{p.stockAlmacen}</span>
                      </div>
                    </div>
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
