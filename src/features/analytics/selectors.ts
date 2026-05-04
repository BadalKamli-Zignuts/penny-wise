import type { Expense, ExpenseCategoryId } from "../expenses/types";

type BudgetStatus = "safe" | "warning" | "over";

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function isSameMonth(dateValue: string, selectedDate: Date) {
  const date = new Date(dateValue);
  return (
    date.getUTCFullYear() === selectedDate.getUTCFullYear() &&
    date.getUTCMonth() === selectedDate.getUTCMonth()
  );
}

export function calculateMonthlyTotal(expenses: Expense[], selectedDate: Date) {
  return expenses
    .filter(
      (expense) =>
        isSameMonth(expense.spentAt, selectedDate) &&
        expense.categoryId !== "income",
    )
    .reduce((total, expense) => total + expense.amount, 0);
}

export function calculateCategoryTotals(
  expenses: Expense[],
  selectedDate: Date,
) {
  // Filter out income from spending categories
  const monthly = expenses.filter(
    (expense) =>
      isSameMonth(expense.spentAt, selectedDate) &&
      expense.categoryId !== "income",
  );
  const total = monthly.reduce((sum, expense) => sum + expense.amount, 0);
  const byCategory = new Map<ExpenseCategoryId, number>();

  monthly.forEach((expense) => {
    byCategory.set(
      expense.categoryId,
      (byCategory.get(expense.categoryId) ?? 0) + expense.amount,
    );
  });

  return Array.from(byCategory.entries())
    .map(([categoryId, categoryTotal]) => ({
      categoryId,
      total: categoryTotal,
      percentage: total === 0 ? 0 : round2((categoryTotal / total) * 100),
    }))
    .sort((a, b) => b.total - a.total);
}

export function calculateBudgetUsage(spent: number, budget: number) {
  const percentage = budget <= 0 ? 0 : round2((spent / budget) * 100);
  const status: BudgetStatus =
    percentage >= 100 ? "over" : percentage >= 70 ? "warning" : "safe";

  return {
    spent,
    budget,
    percentage,
    status,
    remaining: Math.max(budget - spent, 0),
  };
}

export function projectEndOfMonthSpend(
  spentSoFar: number,
  dayOfMonth: number,
  daysInMonth: number,
) {
  if (dayOfMonth <= 0) return 0;
  return round2((spentSoFar / dayOfMonth) * daysInMonth);
}

export function detectAnomalyCandidates(
  comparisons: {
    categoryId: ExpenseCategoryId;
    current: number;
    previous: number;
  }[],
) {
  return comparisons
    .filter((item) => item.previous > 0)
    .map((item) => {
      const changePercent = round2(
        ((item.current - item.previous) / item.previous) * 100,
      );
      return {
        categoryId: item.categoryId,
        changePercent,
        severity: changePercent >= 75 ? ("high" as const) : ("medium" as const),
      };
    })
    .filter((item) => item.changePercent >= 35);
}

export function buildWeeklySeries(expenses: Expense[], selectedDate: Date) {
  // Find the Monday of the current week
  const current = new Date(selectedDate);
  const dayOfWeek = current.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days

  const monday = new Date(current);
  monday.setDate(current.getDate() - daysFromMonday);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);

    const total = expenses
      .filter(
        (expense) =>
          expense.categoryId !== "income" &&
          new Date(expense.spentAt).toISOString().slice(0, 10) ===
            day.toISOString().slice(0, 10),
      )
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      label: day.toLocaleDateString("en", { weekday: "short" }),
      date: day.getDate().toString(),
      value: total,
    };
  });
}

export function buildMonthlySeries(expenses: Expense[], selectedDate: Date) {
  const year = selectedDate.getUTCFullYear();
  const month = selectedDate.getUTCMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Group by week (4-5 weeks in a month)
  const weeks = Math.ceil(daysInMonth / 7);

  return Array.from({ length: weeks }).map((_, weekIndex) => {
    const startDay = weekIndex * 7 + 1;
    const endDay = Math.min(startDay + 6, daysInMonth);

    const total = expenses
      .filter((expense) => {
        if (expense.categoryId === "income") return false;
        const expenseDate = new Date(expense.spentAt);
        if (
          expenseDate.getUTCFullYear() !== year ||
          expenseDate.getUTCMonth() !== month
        ) {
          return false;
        }
        const day = expenseDate.getUTCDate();
        return day >= startDay && day <= endDay;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      label: `W${weekIndex + 1}`,
      value: total,
    };
  });
}

export function buildYearlySeries(expenses: Expense[], selectedDate: Date) {
  const year = selectedDate.getUTCFullYear();

  return Array.from({ length: 12 }).map((_, monthIndex) => {
    const total = expenses
      .filter((expense) => {
        if (expense.categoryId === "income") return false;
        const expenseDate = new Date(expense.spentAt);
        return (
          expenseDate.getUTCFullYear() === year &&
          expenseDate.getUTCMonth() === monthIndex
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return {
      label: monthNames[monthIndex],
      value: total,
    };
  });
}

export function calculateWeeklyTotal(expenses: Expense[], selectedDate: Date) {
  // Find the Monday of the current week
  const current = new Date(selectedDate);
  const dayOfWeek = current.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days

  const monday = new Date(current);
  monday.setDate(current.getDate() - daysFromMonday);
  monday.setHours(0, 0, 0, 0);

  // Calculate Sunday (end of week)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return expenses
    .filter((expense) => {
      if (expense.categoryId === "income") return false;
      const expenseDate = new Date(expense.spentAt);
      return expenseDate >= monday && expenseDate <= sunday;
    })
    .reduce((total, expense) => total + expense.amount, 0);
}
