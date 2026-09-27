"use server";

import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { Batch } from "@/models/Batch";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";

export async function addBatch(data: {
  productoId: string;
  cantidad: number;
  costoUnitario: number;
}) {
  try {
    await connectDB();
    
    // Create new batch
    const newBatch = await Batch.create({
      productoId: data.productoId,
      cantidadInicial: data.cantidad,
      cantidadRestante: data.cantidad,
      costoUnitario: data.costoUnitario,
    });

    // Update Product stockAlmacen
    await Product.findByIdAndUpdate(data.productoId, {
      $inc: { stockAlmacen: data.cantidad }
    });
    
    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    console.error("Error adding batch:", error);
    return { success: false, error: error.message };
  }
}

export async function transferToTienda(data: {
  productoId: string;
  cantidad: number;
}) {
  try {
    await connectDB();
    
    // Verify product has enough stock in Almacen
    const product = await Product.findById(data.productoId);
    if (!product) throw new Error("Producto no encontrado");
    
    if (product.stockAlmacen < data.cantidad) {
      throw new Error(`Solo hay ${product.stockAlmacen} en almacén.`);
    }

    // Move stock
    product.stockAlmacen -= data.cantidad;
    product.stockTienda += data.cantidad;
    await product.save();
    
    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    revalidatePath("/"); // Update POS
    
    return { success: true };
  } catch (error: any) {
    console.error("Error transferring stock:", error);
    return { success: false, error: error.message };
  }
}
