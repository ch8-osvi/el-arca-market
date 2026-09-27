"use server";

import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { revalidatePath } from "next/cache";

import { Batch } from "@/models/Batch";

export async function createProduct(data: {
  nombre: string;
  categoria: string;
  precioVenta: number;
  imagenUrl?: string;
  cantidadInicial?: number;
  costoReferencia?: number;
}) {
  try {
    await connectDB();
    const newProduct = await Product.create({
      nombre: data.nombre,
      categoria: data.categoria,
      precioVenta: data.precioVenta,
      imagenUrl: data.imagenUrl || "",
      stockTienda: 0,
      stockAlmacen: data.cantidadInicial || 0,
    });

    if (data.cantidadInicial && data.costoReferencia) {
      await Batch.create({
        productoId: newProduct._id,
        cantidadInicial: data.cantidadInicial,
        cantidadRestante: data.cantidadInicial,
        costoUnitario: data.costoReferencia,
      });
    }
    
    revalidatePath("/admin/products");
    revalidatePath("/admin/inventory");
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

export async function getBatches() {
  try {
    await connectDB();
    const batches = await Batch.find({}).sort({ fechaEntrada: -1 }).populate("productoId", "nombre");
    return { success: true, batches: JSON.parse(JSON.stringify(batches)) };
  } catch (error: any) {
    console.error("Error fetching batches:", error);
    return { success: false, error: error.message };
  }
}

export async function editProduct(productId: string, data: {
  nombre: string;
  categoria: string;
  precioVenta: number;
  imagenUrl?: string;
}) {
  try {
    await connectDB();
    const product = await Product.findById(productId);
    if (!product) throw new Error("Producto no encontrado");

    product.nombre = data.nombre;
    product.categoria = data.categoria;
    product.precioVenta = data.precioVenta;
    if (data.imagenUrl !== undefined) {
      product.imagenUrl = data.imagenUrl;
    }

    await product.save();
    
    revalidatePath("/admin/products");
    revalidatePath("/admin/inventory");
    revalidatePath("/"); 
    return { success: true };
  } catch (error: any) {
    console.error("Error editing product:", error);
    return { success: false, error: error.message };
  }
}
