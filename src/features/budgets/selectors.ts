import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";

import type { ExpenseCategoryId } from "../expenses/types";
import type { NewBudget } from "./types";

/**
 * Generate a monthly budget for a category
 */
export function createMonthlyBudget(
  categoryId: ExpenseCategoryId,
  amount: number,
  currency: string,
  date: Date = new Date()
): NewBudget {
  return {
    categoryId,
    amount,
    currency,
    period: "monthly",
    startDate: startOfMonth(date).toISOString(),
    endDate: endOfMonth(date).toISOString(),
  };
}

/**
 * Generate a weekly budget for a category
 */
export function createWeeklyBudget(
  categoryId: ExpenseCategoryId,
  amount: number,
  currency: string,
  date: Date = new Date()
): NewBudget {
  return {
    categoryId,
    amount,
    currency,
    period: "weekly",
    startDate: startOfWeek(date, { weekStartsOn: 1 }).toISOString(),
    endDate: endOfWeek(date, { weekStartsOn: 1 }).toISOString(),
  };
}

/**
 * Check if a budget is nearing its limit (>80%)
 */
export function isBudgetNearingLimit(spent: number, budget: number): boolean {
  return spent / budget >= 0.8;
}

/**
 * Check if a budget is exceeded
 */
export function isBudgetExceeded(spent: number, budget: number): boolean {
  return spent > budget;
}
