"use client";

import { deleteProduct } from "@/actions/inventory";
import { useState } from "react";

export default function ProductDeleteButton({ productId, productName }: { productId: string, productName: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm(`¿Estás seguro de eliminar el producto "${productName}"?`)) {
      setLoading(true);
      await deleteProduct(productId);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
      title="Eliminar Producto"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
    </button>
  );
}
