import { useMemo } from "react";

import { useExpenseStore } from "@/features/expenses/hooks";
import { useBudgetsWithSpending } from "./useBudgetsWithSpending";

export function useBudgetIncomeSummary() {
  const budgets = useBudgetsWithSpending();
  const expenses = useExpenseStore((s) => s.expenses);

  return useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const incomeExpenses = expenses.filter(
      (e) => e.categoryId === "income" && new Date(e.spentAt) >= monthStart,
    );

    const totalIncome = incomeExpenses.reduce((sum, e) => sum + e.amount, 0);

    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

    const budgetRemaining = totalBudget - totalSpent;

    return {
      budgets,
      incomeExpenses,
      totalIncome,
      totalBudget,
      totalSpent,
      budgetRemaining,
    };
  }, [budgets, expenses]);
}
