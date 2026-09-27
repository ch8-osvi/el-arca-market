"use client";

import { useState } from "react";
import { markAsPaid } from "@/actions/sales";

export default function MarkPaidButton({ saleId }: { saleId: string }) {
  const [loading, setLoading] = useState(false);

  const handleMarkPaid = async () => {
    if (!confirm("¿Marcar esta venta como pagada?")) return;
    setLoading(true);
    await markAsPaid(saleId);
    setLoading(false);
  };

  return (
    <button
      onClick={handleMarkPaid}
      disabled={loading}
      className="text-[9px] px-1.5 py-0.5 rounded border border-[#D4AF37]/30 text-[#E5C158] hover:bg-[#D4AF37]/10 transition-colors uppercase font-bold disabled:opacity-50 mt-1"
    >
      {loading ? "..." : "Marcar Pagado"}
    </button>
  );
}
