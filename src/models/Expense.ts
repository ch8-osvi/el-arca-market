import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExpense extends Document {
  fecha: Date;
  concepto: string;
  monto: number;
}

const ExpenseSchema: Schema = new Schema(
  {
    fecha: { type: Date, default: Date.now },
    concepto: { type: String, required: true },
    monto: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);
