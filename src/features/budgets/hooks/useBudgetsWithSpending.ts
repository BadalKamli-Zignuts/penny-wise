import { useEffect, useMemo } from "react";

import { useAuthStore } from "../../auth/store";
import { useExpenseStore } from "../../expenses/hooks";
import * as repository from "../repository";
import { createBudgetStore } from "../store";
import type { BudgetWithSpending } from "../types";

// Create the real store with Firebase repository
export const useBudgetStore = createBudgetStore(repository);

/**
 * Hook to sync budgets with Firebase for the current user
 * Call this in your root tabs layout to start real-time sync
 */
export function useBudgetSync() {
  const user = useAuthStore((state) => state.user);
  const startSync = useBudgetStore((state) => state.startSync);
  const clearBudgets = useBudgetStore((state) => state.clearBudgets);

  useEffect(() => {
    if (!user) {
      clearBudgets();
      return;
    }

    const unsubscribe = startSync(user.uid);
    return unsubscribe;
  }, [user, startSync, clearBudgets]);
}

/**
 * Hook to get budgets with current spending data
 */
export function useBudgetsWithSpending(): BudgetWithSpending[] {
  const budgets = useBudgetStore((state) => state.budgets);
  const expenses = useExpenseStore((state) => state.expenses);

  return useMemo(() => {
    return budgets.map((budget) => {
      // Calculate spending for this budget's category within the period
      const spent = expenses
        .filter((expense) => {
          const expenseDate = new Date(expense.spentAt);
          const startDate = new Date(budget.startDate);
          const endDate = new Date(budget.endDate);
          return (
            expense.categoryId === budget.categoryId &&
            expenseDate >= startDate &&
            expenseDate <= endDate
          );
        })
        .reduce((sum, expense) => sum + expense.amount, 0);

      const remaining = budget.amount - spent;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      const isOverBudget = spent > budget.amount;

      return {
        ...budget,
        spent,
        remaining,
        percentage,
        isOverBudget,
      };
    });
  }, [budgets, expenses]);
}
