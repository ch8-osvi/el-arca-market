import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  nombre: string;
  categoria: string;
  precioVenta: number;
  imagenUrl?: string; // Fallback to a default image in UI if not present
  stockTienda: number;
  stockAlmacen: number;
}

const ProductSchema: Schema = new Schema(
  {
    nombre: { type: String, required: true },
    categoria: { type: String, required: true },
    precioVenta: { type: Number, required: true },
    imagenUrl: { type: String, default: "" },
    stockTienda: { type: Number, default: 0 },
    stockAlmacen: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// This ensures that when Next.js reloads, it doesn't try to overwrite the model
export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
