import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import type { BudgetWithSpending } from "../budgets/types";
import { buildCoachContext } from "../coach/context";
import type { Expense } from "../expenses/types";
import type { NewInsight } from "./types";

/**
 * Generate AI-powered insights based on expenses and budgets
 */
export async function generateInsights(
  expenses: Expense[],
  budgets: BudgetWithSpending[],
  currency: string,
  currentDate: Date = new Date(),
): Promise<NewInsight[]> {
  // Early return if no expenses
  if (expenses.length === 0) {
    return [];
  }

  // Build context for AI
  const context = buildCoachContext({
    expenses,
    budgets,
    currency,
    selectedDate: currentDate,
  });

  // Get current and previous month data for comparison
  const thisMonth = expenses.filter((e) => {
    const date = new Date(e.spentAt);
    return (
      date >= startOfMonth(currentDate) &&
      date <= endOfMonth(currentDate) &&
      e.categoryId !== "income"
    );
  });

  const lastMonth = expenses.filter((e) => {
    const date = new Date(e.spentAt);
    const lastMonthStart = startOfMonth(subMonths(currentDate, 1));
    const lastMonthEnd = endOfMonth(subMonths(currentDate, 1));
    return (
      date >= lastMonthStart &&
      date <= lastMonthEnd &&
      e.categoryId !== "income"
    );
  });

  const thisMonthTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);
  const lastMonthTotal = lastMonth.reduce((sum, e) => sum + e.amount, 0);

  // Prepare data for AI
  const aiContext = {
    currency,
    currentMonthName: context.currentMonthName,
    currentMonthTotal: context.currentMonthTotal,
    currentMonthCategories: context.currentMonthCategories,
    previousMonthName: context.previousMonthName,
    previousMonthTotal: context.previousMonthTotal,
    previousMonthCategories: context.previousMonthCategories,
    budgets: context.budgets,
    recentExpenses: context.recentExpenses.slice(0, 10),
    recurringCount: context.recurringExpensesCount,
  };

  try {
    const response = await fetch("/api/ai/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aiContext),
    });

    if (!response.ok) {
      console.warn("AI insights API failed, using fallback");
      return getFallbackInsights(expenses, budgets, currency, currentDate);
    }

    const data = await response.json();
    const rawInsights = data.raw;

    // Parse AI response
    let aiInsights: Array<{
      title: string;
      body: string;
      type?: string;
      priority?: string;
    }> = [];
    try {
      // Try to extract JSON from the response
      const jsonMatch = rawInsights.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        aiInsights = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn("Failed to parse AI insights:", e);
      return getFallbackInsights(expenses, budgets, currency, currentDate);
    }

    // Convert AI insights to our format
    return aiInsights.slice(0, 5).map((insight) => ({
      type: mapInsightType(insight.type),
      priority: mapInsightPriority(insight.priority),
      title: insight.title,
      body: insight.body,
      read: false,
    }));
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return getFallbackInsights(expenses, budgets, currency, currentDate);
  }
}

/**
 * Fallback insights when AI is unavailable (only critical alerts)
 */
function getFallbackInsights(
  expenses: Expense[],
  budgets: BudgetWithSpending[],
  currency: string,
  currentDate: Date,
): NewInsight[] {
  const insights: NewInsight[] = [];

  // Only show critical budget alerts as fallback
  budgets.forEach((budget) => {
    if (budget.isOverBudget) {
      insights.push({
        type: "budget_alert",
        priority: "high",
        title: `${getCategoryName(budget.categoryId)} budget exceeded`,
        body: `You've spent ${currency}${budget.spent.toLocaleString("en-IN")} out of ${currency}${budget.amount.toLocaleString("en-IN")} budget.`,
        categoryId: budget.categoryId,
        amount: budget.spent - budget.amount,
        read: false,
      });
    }
  });

  return insights;
}

function mapInsightType(type?: string): NewInsight["type"] {
  const typeMap: Record<string, NewInsight["type"]> = {
    spending_spike: "spending_spike",
    savings: "savings_opportunity",
    budget: "budget_alert",
    recurring: "recurring_review",
    trend: "category_trend",
    anomaly: "anomaly",
    achievement: "achievement",
  };
  return typeMap[type || ""] || "category_trend";
}

function mapInsightPriority(priority?: string): NewInsight["priority"] {
  if (priority === "high") return "high";
  if (priority === "medium") return "medium";
  return "low";
}

function getCategoryName(categoryId: string): string {
  const names: Record<string, string> = {
    food: "Food",
    transport: "Transport",
    shopping: "Shopping",
    bills: "Bills",
    housing: "Housing",
    subscriptions: "Subscriptions",
    travel: "Travel",
    health: "Health",
    income: "Income",
    other: "Other",
  };
  return names[categoryId] || categoryId;
}
