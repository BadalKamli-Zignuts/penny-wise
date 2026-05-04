import { validateExpenseInput } from "../src/features/expenses/validation";
import { formatMoney } from "../src/lib/money";

test("accepts a valid expense input", () => {
  const result = validateExpenseInput({
    amount: "250.50",
    categoryId: "food",
    merchant: "Cafe",
    note: "Lunch",
    spentAt: new Date("2026-04-30T10:00:00.000Z"),
    recurring: false,
  });

  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(result.value.amount).toBe(250.5);
    expect(result.value.note).toBe("Lunch");
  }
});

test("rejects zero or negative amounts", () => {
  const result = validateExpenseInput({
    amount: "0",
    categoryId: "food",
    merchant: "Cafe",
    note: "",
    spentAt: new Date("2026-04-30T10:00:00.000Z"),
    recurring: false,
  });

  expect(result.ok).toBe(false);
});

test("formats INR by default", () => {
  expect(formatMoney(2450, "₹")).toBe("₹2,450.00");
});
