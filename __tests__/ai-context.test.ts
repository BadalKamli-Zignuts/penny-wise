import { buildCoachContext } from "../src/features/coach/context";
import type { Expense } from "../src/features/expenses/types";

const expenses: Expense[] = [
  {
    id: "1",
    userId: "u1",
    amount: 250,
    currency: "₹",
    categoryId: "food",
    merchant: "Lunch",
    note: "",
    spentAt: "2026-04-30T10:00:00.000Z",
    recurring: false,
    createdAt: "2026-04-30T10:00:00.000Z",
    updatedAt: "2026-04-30T10:00:00.000Z",
  },
];

test("builds compact coach context without raw user ids", () => {
  const context = buildCoachContext({
    expenses,
    currency: "₹",
    selectedDate: new Date("2026-04-30T10:00:00.000Z"),
  });

  expect(JSON.stringify(context)).not.toContain("u1");
  expect(context.recentExpenses[0]).toEqual({
    amount: 250,
    categoryId: "food",
    merchant: "Lunch",
    spentAt: "2026-04-30T10:00:00.000Z",
    recurring: false,
  });
});
