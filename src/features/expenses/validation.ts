import { parseMoneyInput } from "../../lib/money";
import type { ExpenseInput } from "./types";

type ValidationResult =
  | { ok: true; value: Omit<ExpenseInput, "amount"> & { amount: number } }
  | { ok: false; error: string };

export function validateExpenseInput(input: ExpenseInput): ValidationResult {
  const amount = parseMoneyInput(input.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Enter an amount greater than zero." };
  }

  if (!input.categoryId) {
    return { ok: false, error: "Choose a category." };
  }

  return {
    ok: true,
    value: {
      ...input,
      amount,
      merchant: input.merchant.trim(),
      note: input.note.trim(),
    },
  };
}
