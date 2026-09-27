import connectDB from "@/lib/db";
import { Expense } from "@/models/Expense";
import AddExpenseForm from '@/components/admin/AddExpenseForm';
import ExpenseDeleteButton from '@/components/admin/ExpenseDeleteButton';

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  await connectDB();
  
  const expensesRaw = await Expense.find().sort({ fecha: -1 });
  const expenses = JSON.parse(JSON.stringify(expensesRaw));

  const totalExpenses = expenses.reduce((acc: number, curr: any) => acc + curr.monto, 0);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto h-full">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-xl font-black tracking-tight">Gastos Operativos</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
          <div className="glass-card p-4 flex flex-col gap-3 border-red-500/20 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
            <span className="font-bold text-[10px] uppercase tracking-wider text-red-400 relative z-10">Total Gastos (Histórico)</span>
            <div className="text-2xl font-black text-red-400 relative z-10">
              ${totalExpenses.toFixed(2)} <span className="text-xs text-red-400/50 font-bold">CUP</span>
            </div>
          </div>
          <AddExpenseForm />
        </div>

        <div className="flex-1 glass-card p-4 flex flex-col overflow-hidden rounded-xl">
          <h3 className="font-bold text-sm mb-3 shrink-0">Historial de Gastos</h3>
          
          <div className="flex-1 overflow-y-auto pr-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-[var(--color-text-muted)]">
                  <th className="pb-2 font-bold">Fecha</th>
                  <th className="pb-2 font-bold">Concepto</th>
                  <th className="pb-2 font-bold text-right">Monto</th>
                  <th className="pb-2 font-bold text-right w-10"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e: any) => {
                  const date = new Date(e.fecha).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
                  
                  return (
                    <tr key={e._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2.5 text-white/70">{date}</td>
                      <td className="py-2.5 text-white/90 font-medium">{e.concepto}</td>
                      <td className="py-2.5 text-right font-bold text-red-400">${e.monto.toFixed(2)}</td>
                      <td className="py-2.5 text-right">
                        <ExpenseDeleteButton expenseId={e._id.toString()} />
                      </td>
                    </tr>
                  );
                })}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-white/30 text-xs">No hay gastos registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
