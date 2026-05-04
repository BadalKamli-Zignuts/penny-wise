import { createExpenseStore } from "../src/features/expenses/store";

test("adds an optimistic expense before repository write resolves", async () => {
  const created: unknown[] = [];
  const store = createExpenseStore({
    createExpense: async (_userId, expense) => {
      created.push(expense);
      return { id: "server-id" };
    },
    updateExpense: async () => {},
    deleteExpense: async () => {},
    subscribeToExpenses: () => () => {},
  });

  await store.getState().addExpense("u1", {
    amount: 50,
    currency: "₹",
    categoryId: "food",
    merchant: "Tea",
    note: "",
    spentAt: "2026-04-30T10:00:00.000Z",
    recurring: false,
  });

  expect(created).toHaveLength(1);
  expect(store.getState().expenses[0].merchant).toBe("Tea");
  expect(store.getState().expenses[0].id).toBe("server-id");
});
