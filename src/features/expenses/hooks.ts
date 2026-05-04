import { validateExpenseInput } from "@/features/expenses/validation";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthStore } from "../auth/store";
import * as repository from "./repository";
import { createExpenseStore } from "./store";
import { ExpenseCategoryId } from "./types";
export const useExpenseStore = createExpenseStore(repository);

/**
 * Hook to sync expenses with Firebase for the current user
 */
export function useExpenseSync() {
  const user = useAuthStore((state) => state.user);
  const startSync = useExpenseStore((state) => state.startSync);
  const clearExpenses = useExpenseStore((state) => state.clearExpenses);

  useEffect(() => {
    if (!user) {
      clearExpenses();
      return;
    }

    const unsubscribe = startSync(user.uid);
    return unsubscribe;
  }, [user, startSync, clearExpenses]);
}

interface CreateExpenseInputProp {
  amount: string;
  categoryId: ExpenseCategoryId;
  merchant: string;
  note: string;
  recurring: boolean;
  spentAt: Date;
}

export function useCreateExpense({
  user,
  currency,
}: {
  user: User | null;
  currency: string;
}) {
  const addExpense = useExpenseStore((state) => state.addExpense);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createExpense(input: CreateExpenseInputProp) {
    if (!user) return false;

    const result = validateExpenseInput(input);

    if (!result.ok) {
      setError(result.error);
      return false;
    }

    try {
      setLoading(true);

      await addExpense(user.uid, {
        ...result.value,
        currency,
        spentAt: result.value.spentAt.toISOString(),
        merchant: result.value.merchant || "Expense",
      });

      return true;
    } catch {
      setError("Failed to save expense. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { createExpense, error, loading };
}
