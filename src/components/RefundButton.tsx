"use client";

import { refundSale } from "@/actions/sales";
import { useState } from "react";

export default function RefundButton({ saleId }: { saleId: string }) {
  const [loading, setLoading] = useState(false);

  const handleRefund = async () => {
    if (confirm("¿Estás seguro de REEMBOLSAR esta venta? El stock volverá a la tienda.")) {
      setLoading(true);
      const res = await refundSale(saleId);
      if (!res.success) {
        alert("Error: " + res.error);
      }
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleRefund} 
      disabled={loading}
      className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
      title="Reembolsar y devolver stock"
    >
      {loading ? "..." : "Reembolsar"}
    </button>
  );
}
