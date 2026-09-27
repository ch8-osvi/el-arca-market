"use server";

import connectDB from "@/lib/db";
import { Expense } from "@/models/Expense";
import { revalidatePath } from "next/cache";

export async function createExpense(data: { concepto: string; monto: number }) {
  try {
    await connectDB();
    await Expense.create({
      concepto: data.concepto,
      monto: data.monto,
    });
    
    revalidatePath("/admin/expenses");
    revalidatePath("/admin/sales");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteExpense(id: string) {
  try {
    await connectDB();
    await Expense.findByIdAndDelete(id);
    
    revalidatePath("/admin/expenses");
    revalidatePath("/admin/sales");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
