"use client";

export default function ExportCSVButton({ sales, expenses }: { sales: any[], expenses: any[] }) {
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add Sales Headers
    csvContent += "=== REPORTE DE VENTAS ===\n";
    csvContent += "ID Venta,Fecha,Estado,Metodo de Pago,Monto Total (CUP),Ganancia Bruta (CUP)\n";
    
    sales.forEach(sale => {
      if (sale.estadoVenta === "Reembolsada") return;
      
      const date = new Date(sale.fecha).toLocaleString("es-ES");
      
      // Calculate gross profit for this sale
      let gananciaBruta = 0;
      sale.items.forEach((item: any) => {
        gananciaBruta += (item.precioVenta * item.cantidad) - (item.costoCalculadoDesdeLotes || 0);
      });
      
      const row = [
        sale._id,
        `"${date}"`,
        sale.estado,
        sale.metodoPago || "N/A",
        sale.total,
        gananciaBruta
      ].join(",");
      
      csvContent += row + "\n";
    });
    
    csvContent += "\n";

    // Add Expenses Headers
    csvContent += "=== REPORTE DE GASTOS ===\n";
    csvContent += "ID Gasto,Fecha,Motivo,Monto (CUP)\n";
    
    expenses.forEach(exp => {
      const date = new Date(exp.fecha).toLocaleString("es-ES");
      const row = [
        exp._id,
        `"${date}"`,
        `"${exp.motivo}"`,
        exp.monto
      ].join(",");
      
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reporte_arca_market_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={exportToCSV}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors text-xs font-bold whitespace-nowrap"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Exportar CSV
    </button>
  );
}
