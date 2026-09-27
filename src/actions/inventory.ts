"use server";

import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { revalidatePath } from "next/cache";

export async function createProduct(data: {
  nombre: string;
  categoria: string;
  precioVenta: number;
}) {
  try {
    await connectDB();
    const newProduct = await Product.create({
      nombre: data.nombre,
      categoria: data.categoria,
      precioVenta: data.precioVenta,
      stockTienda: 0,
      stockAlmacen: 0,
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/"); // POS page
    return { success: true, product: JSON.parse(JSON.stringify(newProduct)) };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
}

export async function getProducts() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return { success: true, products: JSON.parse(JSON.stringify(products)) };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await connectDB();
    await Product.findByIdAndDelete(productId);
    
    revalidatePath("/admin/products");
    revalidatePath("/"); 
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}
