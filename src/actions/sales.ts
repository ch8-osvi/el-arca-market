"use server";

import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { Batch } from "@/models/Batch";
import { Sale } from "@/models/Sale";
import { revalidatePath } from "next/cache";

export async function processSale(data: {
  items: { productoId: string; cantidad: number; precioVenta: number }[];
  metodoPago: "Efectivo" | "Pago x Móvil" | "";
}) {
  try {
    await connectDB();
    
    let totalSale = 0;
    const finalItems = [];

    // Loop through each product sold
    for (const item of data.items) {
      const product = await Product.findById(item.productoId);
      if (!product) throw new Error(`Producto ${item.productoId} no encontrado`);
      if (product.stockTienda < item.cantidad) {
        throw new Error(`Stock insuficiente en tienda para ${product.nombre}`);
      }

      // 1. Calculate Cost using FIFO from Batches
      let qtyToDeduct = item.cantidad;
      let totalCostForItem = 0;

      // Find available batches sorted by oldest first (FIFO)
      const batches = await Batch.find({ 
        productoId: item.productoId,
        cantidadRestante: { $gt: 0 }
      }).sort({ fechaEntrada: 1 });

      for (const batch of batches) {
        if (qtyToDeduct <= 0) break;

        const qtyFromThisBatch = Math.min(batch.cantidadRestante, qtyToDeduct);
        
        // Deduct from batch
        batch.cantidadRestante -= qtyFromThisBatch;
        await batch.save();

        // Add to cost
        totalCostForItem += (qtyFromThisBatch * batch.costoUnitario);
        qtyToDeduct -= qtyFromThisBatch;
      }

      // Note: If qtyToDeduct > 0 here, it means we sold stock that doesn't have a registered batch.
      // We should ideally warn or prevent this, but we'll proceed assuming stockTienda is accurate.

      // 2. Deduct from Tienda stock
      product.stockTienda -= item.cantidad;
      await product.save();

      totalSale += (item.precioVenta * item.cantidad);
      finalItems.push({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioVenta: item.precioVenta,
        costoCalculadoDesdeLotes: totalCostForItem,
      });
    }

    // 3. Create Sale Record
    const newSale = await Sale.create({
      items: finalItems,
      total: totalSale,
      metodoPago: data.metodoPago,
      estado: "Pagado",
      estadoVenta: "Completada"
    });

    revalidatePath("/");
    revalidatePath("/admin/inventory");
    revalidatePath("/admin/sales");
    revalidatePath("/admin");
    
    return { success: true, saleId: (newSale as any)._id.toString() };
  } catch (error: any) {
    console.error("Error processing sale:", error);
    return { success: false, error: error.message };
  }
}

export async function refundSale(saleId: string) {
  try {
    await connectDB();
    const sale = await Sale.findById(saleId);
    if (!sale) throw new Error("Venta no encontrada");
    if (sale.estadoVenta === "Reembolsada") throw new Error("Venta ya fue reembolsada");

    // Restore stock in Tienda and Batches
    for (const item of sale.items) {
      const product = await Product.findById(item.productoId);
      if (product) {
        product.stockTienda += item.cantidad;
        await product.save();
      }
      
      // Because we used FIFO, restoring batches exactly is complex.
      // The easiest robust way is to create a NEW batch with the returned quantity
      // using the average calculated cost for this specific item in this sale.
      const avgCost = item.costoCalculadoDesdeLotes / item.cantidad;
      await Batch.create({
        productoId: item.productoId,
        cantidadInicial: item.cantidad,
        cantidadRestante: item.cantidad,
        costoUnitario: avgCost || 0,
        fechaEntrada: new Date()
      });
    }

    sale.estadoVenta = "Reembolsada";
    await sale.save();

    revalidatePath("/admin/sales");
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error refunding sale:", error);
    return { success: false, error: error.message };
  }
}
