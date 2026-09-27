"use client";

import { useState } from "react";
import EditProductModal from "./EditProductModal";

export default function EditProductButton({ productStr }: { productStr: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const product = JSON.parse(productStr);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors font-bold text-[10px] uppercase tracking-wider"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        Editar
      </button>

      {isOpen && <EditProductModal product={product} onClose={() => setIsOpen(false)} />}
    </>
  );
}
