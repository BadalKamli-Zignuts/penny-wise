import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { calculateCategoryTotals } from "../analytics/selectors";
import type { BudgetWithSpending } from "../budgets/types";
import type { Expense } from "../expenses/types";

export function buildCoachContext({
  expenses,
  budgets = [],
  currency,
  selectedDate,
}: {
  expenses: Expense[];
  budgets?: BudgetWithSpending[];
  currency: string;
  selectedDate: Date;
}) {
  // Current month calculations
  const currentMonthName = format(selectedDate, "MMMM yyyy");
  const currentMonthStart = startOfMonth(selectedDate);
  const currentMonthEnd = endOfMonth(selectedDate);

  const currentMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.spentAt);
    return (
      date >= currentMonthStart &&
      date <= currentMonthEnd &&
      e.categoryId !== "income"
    );
  });

  const currentMonthTotal = currentMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0,
  );
  const currentMonthCategories = calculateCategoryTotals(
    currentMonthExpenses,
    selectedDate,
  );

  // Previous month calculations
  const prevMonthDate = subMonths(selectedDate, 1);
  const prevMonthName = format(prevMonthDate, "MMMM yyyy");
  const prevMonthStart = startOfMonth(prevMonthDate);
  const prevMonthEnd = endOfMonth(prevMonthDate);

  const prevMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.spentAt);
    return (
      date >= prevMonthStart &&
      date <= prevMonthEnd &&
      e.categoryId !== "income"
    );
  });

  const prevMonthTotal = prevMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0,
  );
  const prevMonthCategories = calculateCategoryTotals(
    prevMonthExpenses,
    prevMonthDate,
  );

  return {
    currency,
    currentMonthName,
    currentMonthTotal,
    currentMonthCategories: currentMonthCategories.map((cat) => ({
      categoryId: cat.categoryId,
      total: cat.total,
      percentage: cat.percentage,
    })),
    previousMonthName: prevMonthName,
    previousMonthTotal: prevMonthTotal,
    previousMonthCategories: prevMonthCategories.map((cat) => ({
      categoryId: cat.categoryId,
      total: cat.total,
      percentage: cat.percentage,
    })),
    budgets: budgets.map((budget) => ({
      categoryId: budget.categoryId,
      amount: budget.amount,
      spent: budget.spent,
      remaining: budget.remaining,
      percentage: budget.percentage,
      isOverBudget: budget.isOverBudget,
    })),
    recentExpenses: expenses
      .filter((e) => e.categoryId !== "income")
      .slice(0, 15)
      .map((expense) => ({
        amount: expense.amount,
        categoryId: expense.categoryId,
        merchant: expense.merchant,
        spentAt: expense.spentAt,
        recurring: expense.recurring,
      })),
    recurringExpensesCount: expenses.filter(
      (e) => e.recurring && e.categoryId !== "income",
    ).length,
  };
}
