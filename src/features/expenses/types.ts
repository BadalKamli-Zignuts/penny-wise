export type ExpenseCategoryId =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "housing"
  | "subscriptions"
  | "travel"
  | "health"
  | "income"
  | "other";

export type Expense = {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  categoryId: ExpenseCategoryId;
  merchant: string;
  note: string;
  spentAt: string;
  recurring: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseInput = {
  amount: string;
  categoryId: ExpenseCategoryId;
  merchant: string;
  note: string;
  spentAt: Date;
  recurring: boolean;
};

export type NewExpense = Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">;
