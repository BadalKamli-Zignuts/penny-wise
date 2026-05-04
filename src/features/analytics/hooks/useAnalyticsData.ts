import {
  endOfMonth,
  startOfMonth,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";

import {
  buildMonthlySeries,
  buildWeeklySeries,
  buildYearlySeries,
  calculateCategoryTotals,
  projectEndOfMonthSpend,
} from "../selectors";

import { getCategory } from "@/constants/categories";
import { Budget } from "@/features/budgets/types";
import { Expense } from "@/features/expenses/types";
import { useMemo } from "react";
import { Period } from "../types";
import { getDateRange } from "../utils";

interface Props {
  expenses: Expense[];
  budgets: Budget[];
  selectedDate: Date;
  period: Period;
}

function getAnalyticsData({ expenses, budgets, selectedDate, period }: Props) {
  const { start, end } = getDateRange({ selectedDate, period });

  const periodExpenses = expenses.filter((e) => {
    const date = new Date(e.spentAt);
    return date >= start && date <= end && e.categoryId !== "income";
  });

  const total = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
  const categories = calculateCategoryTotals(periodExpenses, selectedDate);

  // Calculate previous period based on period type
  let prevStart: Date;
  let prevEnd: Date;

  if (period === "week") {
    const prevWeekDate = subWeeks(selectedDate, 1);
    const prevRange = getDateRange({
      selectedDate: prevWeekDate,
      period: "week",
    });
    prevStart = prevRange.start;
    prevEnd = prevRange.end;
  } else if (period === "year") {
    const prevYearDate = subYears(selectedDate, 1);
    const prevRange = getDateRange({
      selectedDate: prevYearDate,
      period: "year",
    });
    prevStart = prevRange.start;
    prevEnd = prevRange.end;
  } else {
    // month
    prevStart = startOfMonth(subMonths(selectedDate, 1));
    prevEnd = endOfMonth(subMonths(selectedDate, 1));
  }

  const prevExpenses = expenses.filter((e) => {
    const date = new Date(e.spentAt);
    return date >= prevStart && date <= prevEnd && e.categoryId !== "income";
  });
  const prevTotal = prevExpenses.reduce((sum, e) => sum + e.amount, 0);
  const comparison =
    prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const budgetDiff = total - totalBudget;

  const projected =
    period === "month"
      ? projectEndOfMonthSpend(
          total,
          selectedDate.getDate(),
          new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth() + 1,
            0,
          ).getDate(),
        )
      : total;

  const donutData = categories
    .map((c) => {
      const cat = getCategory(c.categoryId);
      return {
        name: cat.name,
        value: c.total,
        color: cat.color,
        percentage: c.percentage,
      };
    })
    .sort((a, b) => b.value - a.value);

  const seriesData =
    period === "week"
      ? buildWeeklySeries(expenses, selectedDate)
      : period === "year"
        ? buildYearlySeries(expenses, selectedDate)
        : buildMonthlySeries(expenses, selectedDate);

  const series = seriesData.map((point) => point.value);
  const labels = seriesData.map((point) => point.label);
  const dates =
    period === "week"
      ? seriesData.map((point) => (point as any).date)
      : undefined;

  return {
    total,
    categories,
    comparison,
    prevTotal,
    prevStart,
    totalBudget,
    budgetDiff,
    projected,
    series,
    labels,
    dates,
    donutData,
  };
}

export function useAnalyticsData(params: Props) {
  return useMemo(() => getAnalyticsData(params), [params]);
}
