import { create, type StoreApi, type UseBoundStore } from "zustand";

import type { Expense, NewExpense } from "./types";

type ExpenseRepository = {
  createExpense: (
    userId: string,
    expense: NewExpense,
  ) => Promise<{ id: string }>;
  updateExpense: (
    userId: string,
    expenseId: string,
    expense: Partial<Expense>,
  ) => Promise<void>;
  deleteExpense: (userId: string, expenseId: string) => Promise<void>;
  subscribeToExpenses: (
    userId: string,
    callback: (expenses: Expense[]) => void,
  ) => () => void;
};

type ExpenseState = {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  synced: boolean;
  setExpenses: (expenses: Expense[]) => void;
  setSynced: (synced: boolean) => void;
  startSync: (userId: string) => () => void;
  addExpense: (userId: string, expense: NewExpense) => Promise<void>;
  updateExpense: (
    userId: string,
    expenseId: string,
    expense: Partial<Expense>,
  ) => Promise<void>;
  deleteExpense: (userId: string, expenseId: string) => Promise<void>;
  clearExpenses: () => void;
};

export function createExpenseStore(
  repo: ExpenseRepository,
): UseBoundStore<StoreApi<ExpenseState>> {
  return create<ExpenseState>((set, get) => ({
    expenses: [],
    loading: false,
    error: null,
    synced: false,
    setExpenses: (expenses) => set({ expenses }),
    setSynced: (synced) => set({ synced }),
    startSync: (userId) => {
      set({ loading: true });
      const unsubscribe = repo.subscribeToExpenses(userId, (expenses) => {
        set({ expenses, loading: false, synced: true, error: null });
      });
      return unsubscribe;
    },
    addExpense: async (userId, expense) => {
      const optimistic: Expense = {
        ...expense,
        id: `local-${Date.now()}`,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        expenses: [optimistic, ...state.expenses],
        error: null,
      }));

      try {
        const result = await repo.createExpense(userId, expense);
        set((state) => ({
          expenses: state.expenses.map((item) =>
            item.id === optimistic.id ? { ...item, id: result.id } : item,
          ),
        }));
      } catch (error) {
        set((state) => ({
          expenses: state.expenses.filter((item) => item.id !== optimistic.id),
          error: "Could not save expense. Try again.",
        }));
        throw error;
      }
    },
    updateExpense: async (userId, expenseId, expense) => {
      const before = get().expenses;
      set((state) => ({
        expenses: state.expenses.map((item) =>
          item.id === expenseId
            ? { ...item, ...expense, updatedAt: new Date().toISOString() }
            : item,
        ),
      }));

      try {
        await repo.updateExpense(userId, expenseId, expense);
      } catch (error) {
        set({
          expenses: before,
          error: "Could not update expense. Try again.",
        });
        throw error;
      }
    },
    deleteExpense: async (userId, expenseId) => {
      const before = get().expenses;
      set((state) => ({
        expenses: state.expenses.filter((item) => item.id !== expenseId),
      }));

      try {
        await repo.deleteExpense(userId, expenseId);
      } catch (error) {
        set({
          expenses: before,
          error: "Could not delete expense. Try again.",
        });
        throw error;
      }
    },
    clearExpenses: () => set({ expenses: [], synced: false }),
  }));
}

// Default store with no-op repository (will be replaced with real one)
const noOpRepository: ExpenseRepository = {
  createExpense: async () => ({ id: `local-${Date.now()}` }),
  updateExpense: async () => {},
  deleteExpense: async () => {},
  subscribeToExpenses: () => () => {},
};

export const useExpenseStore = createExpenseStore(noOpRepository);
