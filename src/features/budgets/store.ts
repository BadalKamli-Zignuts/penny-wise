import { create, type StoreApi, type UseBoundStore } from "zustand";

import type { Budget, NewBudget } from "./types";

type BudgetRepository = {
  createBudget: (userId: string, budget: NewBudget) => Promise<{ id: string }>;
  updateBudget: (userId: string, budgetId: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (userId: string, budgetId: string) => Promise<void>;
  subscribeToBudgets: (userId: string, callback: (budgets: Budget[]) => void) => () => void;
};

type BudgetState = {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  synced: boolean;
  setBudgets: (budgets: Budget[]) => void;
  setSynced: (synced: boolean) => void;
  startSync: (userId: string) => () => void;
  addBudget: (userId: string, budget: NewBudget) => Promise<void>;
  updateBudget: (userId: string, budgetId: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (userId: string, budgetId: string) => Promise<void>;
  clearBudgets: () => void;
};

export function createBudgetStore(repo: BudgetRepository): UseBoundStore<StoreApi<BudgetState>> {
  return create<BudgetState>((set, get) => ({
    budgets: [],
    loading: false,
    error: null,
    synced: false,
    setBudgets: (budgets) => set({ budgets }),
    setSynced: (synced) => set({ synced }),
    startSync: (userId) => {
      set({ loading: true });
      const unsubscribe = repo.subscribeToBudgets(userId, (budgets) => {
        set({ budgets, loading: false, synced: true, error: null });
      });
      return unsubscribe;
    },
    addBudget: async (userId, budget) => {
      const optimistic: Budget = {
        ...budget,
        id: `local-${Date.now()}`,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({ budgets: [optimistic, ...state.budgets], error: null }));

      try {
        const result = await repo.createBudget(userId, budget);
        set((state) => ({
          budgets: state.budgets.map((item) => (item.id === optimistic.id ? { ...item, id: result.id } : item)),
        }));
      } catch (error) {
        set((state) => ({
          budgets: state.budgets.filter((item) => item.id !== optimistic.id),
          error: "Could not save budget. Try again.",
        }));
        throw error;
      }
    },
    updateBudget: async (userId, budgetId, budget) => {
      const before = get().budgets;
      set((state) => ({
        budgets: state.budgets.map((item) => (item.id === budgetId ? { ...item, ...budget, updatedAt: new Date().toISOString() } : item)),
      }));

      try {
        await repo.updateBudget(userId, budgetId, budget);
      } catch (error) {
        set({ budgets: before, error: "Could not update budget. Try again." });
        throw error;
      }
    },
    deleteBudget: async (userId, budgetId) => {
      const before = get().budgets;
      set((state) => ({ budgets: state.budgets.filter((item) => item.id !== budgetId) }));

      try {
        await repo.deleteBudget(userId, budgetId);
      } catch (error) {
        set({ budgets: before, error: "Could not delete budget. Try again." });
        throw error;
      }
    },
    clearBudgets: () => set({ budgets: [], synced: false }),
  }));
}

// Default store with no-op repository (will be replaced with real one)
const noOpRepository: BudgetRepository = {
  createBudget: async () => ({ id: `local-${Date.now()}` }),
  updateBudget: async () => {},
  deleteBudget: async () => {},
  subscribeToBudgets: () => () => {},
};

export const useBudgetStore = createBudgetStore(noOpRepository);
