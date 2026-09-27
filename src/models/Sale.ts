import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISaleItem {
  productoId: Types.ObjectId;
  cantidad: number;
  precioVenta: number;
  costoCalculadoDesdeLotes: number; // For exact profit calculation
}

export interface ISale extends Document {
  fecha: Date;
  items: ISaleItem[];
  total: number;
  estado: "Pagado" | "Pendiente";
  metodoPago: "Efectivo" | "Pago x Móvil" | "";
  notas: string;
  estadoVenta: "Completada" | "Reembolsada";
}

const SaleItemSchema: Schema = new Schema({
  productoId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  cantidad: { type: Number, required: true },
  precioVenta: { type: Number, required: true },
  costoCalculadoDesdeLotes: { type: Number, required: true },
});

const SaleSchema: Schema = new Schema(
  {
    fecha: { type: Date, default: Date.now },
    items: [SaleItemSchema],
    total: { type: Number, required: true },
    estado: { type: String, enum: ["Pagado", "Pendiente"], default: "Pagado" },
    metodoPago: { type: String, enum: ["Efectivo", "Pago x Móvil", ""], default: "Efectivo" },
    notas: { type: String, default: "" },
    estadoVenta: { type: String, enum: ["Completada", "Reembolsada"], default: "Completada" },
  },
  { timestamps: true }
);

export const Sale: Model<ISale> =
  mongoose.models.Sale || mongoose.model<ISale>("Sale", SaleSchema);
