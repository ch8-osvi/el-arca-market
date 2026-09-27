"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold">Ocurrió un error en el sistema</h2>
        <p className="text-[var(--color-text-muted)] text-sm">{error.message || "Error interno del servidor. Por favor, intenta de nuevo."}</p>
      </div>
      <button
        onClick={() => reset()}
        className="px-4 py-2 mt-2 rounded-lg bg-[#D4AF37] text-[#090A0F] font-bold text-sm hover:opacity-90 transition-all"
      >
        Reintentar
      </button>
    </div>
  );
}
