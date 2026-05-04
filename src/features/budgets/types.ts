import type { ExpenseCategoryId } from "../expenses/types";

export type Budget = {
  id: string;
  userId: string;
  categoryId: ExpenseCategoryId;
  amount: number;
  currency: string;
  period: "monthly" | "weekly";
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type NewBudget = Omit<Budget, "id" | "userId" | "createdAt" | "updatedAt">;

export type BudgetWithSpending = Budget & {
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
};
