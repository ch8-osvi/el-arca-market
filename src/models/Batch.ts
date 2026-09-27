import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBatch extends Document {
  productoId: Types.ObjectId;
  fechaEntrada: Date;
  cantidadInicial: number;
  cantidadRestante: number;
  costoUnitario: number;
}

const BatchSchema: Schema = new Schema(
  {
    productoId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    fechaEntrada: { type: Date, default: Date.now },
    cantidadInicial: { type: Number, required: true },
    cantidadRestante: { type: Number, required: true },
    costoUnitario: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Batch: Model<IBatch> =
  mongoose.models.Batch || mongoose.model<IBatch>("Batch", BatchSchema);
