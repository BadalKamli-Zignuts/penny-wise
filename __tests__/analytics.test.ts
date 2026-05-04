import {
  calculateBudgetUsage,
  calculateCategoryTotals,
  calculateMonthlyTotal,
  detectAnomalyCandidates,
  projectEndOfMonthSpend,
} from "../src/features/analytics/selectors";
import type { Expense } from "../src/features/expenses/types";

const expenses: Expense[] = [
  {
    id: "1",
    userId: "u1",
    amount: 500,
    currency: "₹",
    categoryId: "food",
    merchant: "Cafe",
    note: "",
    spentAt: "2026-04-02T10:00:00.000Z",
    recurring: false,
    createdAt: "2026-04-02T10:00:00.000Z",
    updatedAt: "2026-04-02T10:00:00.000Z",
  },
  {
    id: "2",
    userId: "u1",
    amount: 1000,
    currency: "₹",
    categoryId: "transport",
    merchant: "Metro",
    note: "",
    spentAt: "2026-04-10T10:00:00.000Z",
    recurring: false,
    createdAt: "2026-04-10T10:00:00.000Z",
    updatedAt: "2026-04-10T10:00:00.000Z",
  },
  {
    id: "3",
    userId: "u1",
    amount: 700,
    currency: "₹",
    categoryId: "food",
    merchant: "Dinner",
    note: "",
    spentAt: "2026-03-10T10:00:00.000Z",
    recurring: false,
    createdAt: "2026-03-10T10:00:00.000Z",
    updatedAt: "2026-03-10T10:00:00.000Z",
  },
];

test("calculates monthly totals for a selected month", () => {
  expect(calculateMonthlyTotal(expenses, new Date("2026-04-30"))).toBe(1500);
});

test("calculates category totals", () => {
  expect(calculateCategoryTotals(expenses, new Date("2026-04-30"))).toEqual([
    { categoryId: "transport", total: 1000, percentage: 66.67 },
    { categoryId: "food", total: 500, percentage: 33.33 },
  ]);
});

test("calculates budget usage", () => {
  expect(calculateBudgetUsage(850, 1200)).toEqual({
    spent: 850,
    budget: 1200,
    percentage: 70.83,
    status: "warning",
    remaining: 350,
  });
});

test("projects end of month spend", () => {
  expect(projectEndOfMonthSpend(1500, 10, 30)).toBe(4500);
});

test("detects category anomaly candidates", () => {
  expect(detectAnomalyCandidates([{ categoryId: "food", current: 2000, previous: 1000 }])).toEqual([
    { categoryId: "food", changePercent: 100, severity: "high" },
  ]);
});
