# Penny Wise Mobile App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a connected Expo SDK 55 mobile expense coach app in `penny-wise-mobile-app` using Firebase Auth/Firestore and Groq through an Expo API boundary.

**Architecture:** Scaffold a typed Expo Router app, isolate domain logic under `src/features`, keep Firebase behind repository modules, and keep Groq calls behind `app/api/ai/*+api.ts`. Screens consume Zustand stores and pure analytics selectors instead of reaching directly into Firestore.

**Tech Stack:** Expo SDK 55, React Native 0.83, React 19.2, TypeScript, Expo Router, NativeWind, Zustand, Firebase JS SDK, Groq SDK or fetch API, Victory Native, lucide-react-native, Jest/Vitest-compatible unit tests.

---

## File Structure

- Create `package.json`, `app.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`, `nativewind-env.d.ts`, `tailwind.config.js`, `.gitignore`, `.env.example`, `README.md`.
- Create `app/_layout.tsx`, `app/index.tsx`, `app/(auth)/_layout.tsx`, `app/(auth)/sign-in.tsx`, `app/(auth)/sign-up.tsx`, `app/(auth)/verify.tsx`.
- Create `app/onboarding/index.tsx`.
- Create `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/analytics.tsx`, `app/(tabs)/activity.tsx`, `app/(tabs)/coach.tsx`, `app/(tabs)/settings.tsx`.
- Create `app/expense/new.tsx`, `app/expense/[id].tsx`.
- Create `app/api/ai/chat+api.ts`, `app/api/ai/insights+api.ts`.
- Create `src/theme/colors.ts`, `src/theme/categories.ts`.
- Create `src/components/ui/*` for reusable primitives.
- Create `src/components/charts/*` for chart wrappers.
- Create `src/features/auth/*`, `src/features/expenses/*`, `src/features/analytics/*`, `src/features/coach/*`, `src/features/settings/*`.
- Create `src/lib/firebase/config.ts`, `src/lib/firebase/auth.ts`, `src/lib/firebase/firestore.ts`.
- Create `src/lib/env.ts`, `src/lib/errors.ts`, `src/lib/date.ts`, `src/lib/money.ts`.
- Create `__tests__/analytics.test.ts`, `__tests__/expense-validation.test.ts`, `__tests__/ai-context.test.ts`, `__tests__/store-expenses.test.ts`.

---

### Task 1: Scaffold Expo SDK 55 App

**Files:**
- Create: root Expo config and package files in `/Users/ztlab131/Desktop/projects/penny-wise/penny-wise-mobile-app`
- Create: `app/_layout.tsx`
- Create: `app/index.tsx`

- [ ] **Step 1: Create the Expo project skeleton**

Run from `/Users/ztlab131/Desktop/projects/penny-wise/penny-wise-mobile-app`:

```bash
npx create-expo-app@latest . --template default@sdk-55
```

Expected: Expo creates a TypeScript app with `app/`, `package.json`, and Expo Router configured.

- [ ] **Step 2: Install app dependencies**

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-status-bar expo-linear-gradient expo-blur
npm install nativewind tailwindcss zustand firebase lucide-react-native victory-native react-native-svg zod
npm install -D jest jest-expo @testing-library/react-native @testing-library/jest-native ts-jest
```

Expected: dependencies are added to `package.json`.

- [ ] **Step 3: Add scripts**

Set scripts in `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest --runInBand",
    "typecheck": "tsc --noEmit",
    "lint": "expo lint"
  }
}
```

- [ ] **Step 4: Verify scaffold**

Run:

```bash
npm run typecheck
```

Expected: TypeScript completes or reports only template-created issues that will be fixed in later tasks.

---

### Task 2: Configure NativeWind, Env, And Theme Tokens

**Files:**
- Create/Modify: `tailwind.config.js`
- Modify: `babel.config.js`
- Create: `nativewind-env.d.ts`
- Create: `.env.example`
- Create: `src/lib/env.ts`
- Create: `src/theme/colors.ts`

- [ ] **Step 1: Add NativeWind config**

`tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lumen: {
          bg: "#0A0B12",
          card: "#11131C",
          border: "rgba(255,255,255,0.08)",
          secondary: "#8B8D98",
          violet: "#8B5CF6",
          indigo: "#6366F1",
          cyan: "#06B6D4",
          mint: "#34D399",
          amber: "#FBBF24",
          coral: "#FB7185"
        }
      }
    }
  },
  plugins: []
};
```

- [ ] **Step 2: Configure Babel**

`babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"]
  };
};
```

- [ ] **Step 3: Add NativeWind type declaration**

`nativewind-env.d.ts`:

```ts
/// <reference types="nativewind/types" />
```

- [ ] **Step 4: Add credential template**

`.env.example`:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
```

- [ ] **Step 5: Add environment reader**

`src/lib/env.ts`:

```ts
export const env = {
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? ""
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY ?? "",
    model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile"
  }
};

export function getMissingFirebaseKeys() {
  return Object.entries(env.firebase)
    .filter(([, value]) => value.length === 0)
    .map(([key]) => key);
}
```

- [ ] **Step 6: Add theme constants**

`src/theme/colors.ts`:

```ts
export const colors = {
  bg: "#0A0B12",
  card: "#11131C",
  border: "rgba(255,255,255,0.08)",
  primaryText: "#FFFFFF",
  secondaryText: "#8B8D98",
  violet: "#8B5CF6",
  indigo: "#6366F1",
  cyan: "#06B6D4",
  mint: "#34D399",
  amber: "#FBBF24",
  coral: "#FB7185"
} as const;
```

---

### Task 3: Test And Implement Domain Models, Validation, And Money Helpers

**Files:**
- Create: `src/features/expenses/types.ts`
- Create: `src/features/expenses/validation.ts`
- Create: `src/lib/money.ts`
- Test: `__tests__/expense-validation.test.ts`

- [ ] **Step 1: Write failing validation tests**

`__tests__/expense-validation.test.ts`:

```ts
import { validateExpenseInput } from "../src/features/expenses/validation";
import { formatMoney } from "../src/lib/money";

test("accepts a valid expense input", () => {
  const result = validateExpenseInput({
    amount: "250.50",
    categoryId: "food",
    merchant: "Cafe",
    note: "Lunch",
    spentAt: new Date("2026-04-30T10:00:00.000Z"),
    recurring: false
  });

  expect(result.ok).toBe(true);
  if (result.ok) expect(result.value.amount).toBe(250.5);
});

test("rejects zero or negative amounts", () => {
  const result = validateExpenseInput({
    amount: "0",
    categoryId: "food",
    merchant: "Cafe",
    note: "",
    spentAt: new Date("2026-04-30T10:00:00.000Z"),
    recurring: false
  });

  expect(result.ok).toBe(false);
});

test("formats INR by default", () => {
  expect(formatMoney(2450, "₹")).toBe("₹2,450.00");
});
```

- [ ] **Step 2: Run test and verify red**

```bash
npm run test -- __tests__/expense-validation.test.ts
```

Expected: FAIL because modules do not exist.

- [ ] **Step 3: Implement types and validation**

`src/features/expenses/types.ts`:

```ts
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
```

`src/features/expenses/validation.ts`:

```ts
import type { ExpenseInput } from "./types";

type ValidationResult =
  | { ok: true; value: Omit<ExpenseInput, "amount"> & { amount: number } }
  | { ok: false; error: string };

export function validateExpenseInput(input: ExpenseInput): ValidationResult {
  const amount = Number(input.amount);

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
      note: input.note.trim()
    }
  };
}
```

`src/lib/money.ts`:

```ts
export function formatMoney(value: number, currencySymbol = "₹") {
  return `${currencySymbol}${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
```

- [ ] **Step 4: Run test and verify green**

```bash
npm run test -- __tests__/expense-validation.test.ts
```

Expected: PASS.

---

### Task 4: Test And Implement Analytics Selectors

**Files:**
- Create: `src/features/analytics/selectors.ts`
- Test: `__tests__/analytics.test.ts`

- [ ] **Step 1: Write failing analytics tests**

`__tests__/analytics.test.ts`:

```ts
import {
  calculateCategoryTotals,
  calculateMonthlyTotal,
  calculateBudgetUsage,
  projectEndOfMonthSpend,
  detectAnomalyCandidates
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
    updatedAt: "2026-04-02T10:00:00.000Z"
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
    updatedAt: "2026-04-10T10:00:00.000Z"
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
    updatedAt: "2026-03-10T10:00:00.000Z"
  }
];

test("calculates monthly totals for a selected month", () => {
  expect(calculateMonthlyTotal(expenses, new Date("2026-04-30"))).toBe(1500);
});

test("calculates category totals", () => {
  expect(calculateCategoryTotals(expenses, new Date("2026-04-30"))).toEqual([
    { categoryId: "transport", total: 1000, percentage: 66.67 },
    { categoryId: "food", total: 500, percentage: 33.33 }
  ]);
});

test("calculates budget usage", () => {
  expect(calculateBudgetUsage(850, 1200)).toEqual({
    spent: 850,
    budget: 1200,
    percentage: 70.83,
    status: "warning",
    remaining: 350
  });
});

test("projects end of month spend", () => {
  expect(projectEndOfMonthSpend(1500, 10, 30)).toBe(4500);
});

test("detects category anomaly candidates", () => {
  expect(detectAnomalyCandidates([{ categoryId: "food", current: 2000, previous: 1000 }])).toEqual([
    { categoryId: "food", changePercent: 100, severity: "high" }
  ]);
});
```

- [ ] **Step 2: Run test and verify red**

```bash
npm run test -- __tests__/analytics.test.ts
```

Expected: FAIL because selectors do not exist.

- [ ] **Step 3: Implement selectors**

`src/features/analytics/selectors.ts`:

```ts
import type { Expense, ExpenseCategoryId } from "../expenses/types";

type BudgetStatus = "safe" | "warning" | "over";

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function isSameMonth(dateValue: string, selectedDate: Date) {
  const date = new Date(dateValue);
  return date.getUTCFullYear() === selectedDate.getUTCFullYear() && date.getUTCMonth() === selectedDate.getUTCMonth();
}

export function calculateMonthlyTotal(expenses: Expense[], selectedDate: Date) {
  return expenses
    .filter((expense) => isSameMonth(expense.spentAt, selectedDate))
    .reduce((total, expense) => total + expense.amount, 0);
}

export function calculateCategoryTotals(expenses: Expense[], selectedDate: Date) {
  const monthly = expenses.filter((expense) => isSameMonth(expense.spentAt, selectedDate));
  const total = monthly.reduce((sum, expense) => sum + expense.amount, 0);
  const byCategory = new Map<ExpenseCategoryId, number>();

  monthly.forEach((expense) => {
    byCategory.set(expense.categoryId, (byCategory.get(expense.categoryId) ?? 0) + expense.amount);
  });

  return Array.from(byCategory.entries())
    .map(([categoryId, categoryTotal]) => ({
      categoryId,
      total: categoryTotal,
      percentage: total === 0 ? 0 : round2((categoryTotal / total) * 100)
    }))
    .sort((a, b) => b.total - a.total);
}

export function calculateBudgetUsage(spent: number, budget: number) {
  const percentage = budget <= 0 ? 0 : round2((spent / budget) * 100);
  const status: BudgetStatus = percentage >= 100 ? "over" : percentage >= 70 ? "warning" : "safe";

  return {
    spent,
    budget,
    percentage,
    status,
    remaining: Math.max(budget - spent, 0)
  };
}

export function projectEndOfMonthSpend(spentSoFar: number, dayOfMonth: number, daysInMonth: number) {
  if (dayOfMonth <= 0) return 0;
  return round2((spentSoFar / dayOfMonth) * daysInMonth);
}

export function detectAnomalyCandidates(
  comparisons: Array<{ categoryId: ExpenseCategoryId; current: number; previous: number }>
) {
  return comparisons
    .filter((item) => item.previous > 0)
    .map((item) => ({
      categoryId: item.categoryId,
      changePercent: round2(((item.current - item.previous) / item.previous) * 100),
      severity: ((item.current - item.previous) / item.previous) * 100 >= 75 ? "high" : "medium"
    }))
    .filter((item) => item.changePercent >= 35);
}
```

- [ ] **Step 4: Run test and verify green**

```bash
npm run test -- __tests__/analytics.test.ts
```

Expected: PASS.

---

### Task 5: Firebase Configuration And Repositories

**Files:**
- Create: `src/lib/firebase/config.ts`
- Create: `src/lib/firebase/auth.ts`
- Create: `src/lib/firebase/firestore.ts`
- Create: `src/features/expenses/repository.ts`
- Create: `src/features/settings/repository.ts`

- [ ] **Step 1: Add Firebase app config**

`src/lib/firebase/config.ts`:

```ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { env, getMissingFirebaseKeys } from "../env";

const missingKeys = getMissingFirebaseKeys();

if (__DEV__ && missingKeys.length > 0) {
  console.warn(`Missing Firebase env values: ${missingKeys.join(", ")}. Copy .env.example to .env and fill Firebase config.`);
}

const app = getApps().length ? getApps()[0] : initializeApp(env.firebase);

export const firebaseAuth = getAuth(app);
export const firestore = getFirestore(app);
```

- [ ] **Step 2: Add auth wrapper**

`src/lib/firebase/auth.ts`:

```ts
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  type User
} from "firebase/auth";
import { firebaseAuth } from "./config";

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(firebaseAuth, callback);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
}

export async function signUpWithEmail(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
  await sendEmailVerification(credential.user);
  return credential;
}

export async function signOutUser() {
  await signOut(firebaseAuth);
}
```

- [ ] **Step 3: Add expense repository**

`src/features/expenses/repository.ts`:

```ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { firestore } from "../../lib/firebase/config";
import type { Expense } from "./types";

function expensesCollection(userId: string) {
  return collection(firestore, "users", userId, "expenses");
}

export function subscribeToExpenses(userId: string, callback: (expenses: Expense[]) => void) {
  const q = query(expensesCollection(userId), orderBy("spentAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Expense));
  });
}

export async function createExpense(userId: string, expense: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">) {
  return addDoc(expensesCollection(userId), {
    ...expense,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateExpense(userId: string, expenseId: string, expense: Partial<Expense>) {
  await updateDoc(doc(firestore, "users", userId, "expenses", expenseId), {
    ...expense,
    updatedAt: serverTimestamp()
  });
}

export async function deleteExpense(userId: string, expenseId: string) {
  await deleteDoc(doc(firestore, "users", userId, "expenses", expenseId));
}
```

- [ ] **Step 4: Typecheck Firebase modules**

```bash
npm run typecheck
```

Expected: PASS or only errors from screens not yet implemented.

---

### Task 6: Zustand Stores With Repository Boundaries

**Files:**
- Create: `src/features/auth/store.ts`
- Create: `src/features/expenses/store.ts`
- Create: `src/features/settings/store.ts`
- Create: `src/features/coach/store.ts`
- Test: `__tests__/store-expenses.test.ts`

- [ ] **Step 1: Write failing expense store test**

`__tests__/store-expenses.test.ts`:

```ts
import { createExpenseStore } from "../src/features/expenses/store";

test("adds an optimistic expense before repository write resolves", async () => {
  const created: unknown[] = [];
  const store = createExpenseStore({
    createExpense: async (_userId, expense) => {
      created.push(expense);
      return { id: "server-id" };
    }
  });

  await store.getState().addExpense("u1", {
    amount: 50,
    currency: "₹",
    categoryId: "food",
    merchant: "Tea",
    note: "",
    spentAt: "2026-04-30T10:00:00.000Z",
    recurring: false
  });

  expect(created).toHaveLength(1);
  expect(store.getState().expenses[0].merchant).toBe("Tea");
});
```

- [ ] **Step 2: Run test and verify red**

```bash
npm run test -- __tests__/store-expenses.test.ts
```

Expected: FAIL because store does not exist.

- [ ] **Step 3: Implement expense store factory**

`src/features/expenses/store.ts`:

```ts
import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { Expense } from "./types";
import * as repository from "./repository";

type CreateExpenseInput = Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">;

type ExpenseRepository = {
  createExpense: (userId: string, expense: CreateExpenseInput) => Promise<{ id: string }>;
};

type ExpenseState = {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (userId: string, expense: CreateExpenseInput) => Promise<void>;
};

export function createExpenseStore(repo: ExpenseRepository): UseBoundStore<StoreApi<ExpenseState>> {
  return create<ExpenseState>((set) => ({
    expenses: [],
    loading: false,
    error: null,
    setExpenses: (expenses) => set({ expenses }),
    addExpense: async (userId, expense) => {
      const optimistic: Expense = {
        ...expense,
        id: `local-${Date.now()}`,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      set((state) => ({ expenses: [optimistic, ...state.expenses], error: null }));

      try {
        const result = await repo.createExpense(userId, expense);
        set((state) => ({
          expenses: state.expenses.map((item) => (item.id === optimistic.id ? { ...item, id: result.id } : item))
        }));
      } catch {
        set((state) => ({
          expenses: state.expenses.filter((item) => item.id !== optimistic.id),
          error: "Could not save expense. Try again."
        }));
      }
    }
  }));
}

export const useExpenseStore = createExpenseStore({
  createExpense: repository.createExpense
});
```

- [ ] **Step 4: Run store test and verify green**

```bash
npm run test -- __tests__/store-expenses.test.ts
```

Expected: PASS.

---

### Task 7: AI Context And Groq API Routes

**Files:**
- Create: `src/features/coach/context.ts`
- Create: `src/features/coach/types.ts`
- Create: `app/api/ai/chat+api.ts`
- Create: `app/api/ai/insights+api.ts`
- Test: `__tests__/ai-context.test.ts`

- [ ] **Step 1: Write failing AI context tests**

`__tests__/ai-context.test.ts`:

```ts
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
    updatedAt: "2026-04-30T10:00:00.000Z"
  }
];

test("builds compact coach context without raw user ids", () => {
  const context = buildCoachContext({
    expenses,
    currency: "₹",
    selectedDate: new Date("2026-04-30T10:00:00.000Z")
  });

  expect(JSON.stringify(context)).not.toContain("u1");
  expect(context.recentExpenses[0]).toEqual({
    amount: 250,
    categoryId: "food",
    merchant: "Lunch",
    spentAt: "2026-04-30T10:00:00.000Z"
  });
});
```

- [ ] **Step 2: Run test and verify red**

```bash
npm run test -- __tests__/ai-context.test.ts
```

Expected: FAIL because context builder does not exist.

- [ ] **Step 3: Implement AI context builder**

`src/features/coach/context.ts`:

```ts
import { calculateCategoryTotals, calculateMonthlyTotal } from "../analytics/selectors";
import type { Expense } from "../expenses/types";

export function buildCoachContext({
  expenses,
  currency,
  selectedDate
}: {
  expenses: Expense[];
  currency: string;
  selectedDate: Date;
}) {
  return {
    period: "month" as const,
    currency,
    totals: {
      monthlySpend: calculateMonthlyTotal(expenses, selectedDate)
    },
    topCategories: calculateCategoryTotals(expenses, selectedDate).slice(0, 5),
    recentExpenses: expenses.slice(0, 12).map((expense) => ({
      amount: expense.amount,
      categoryId: expense.categoryId,
      merchant: expense.merchant,
      spentAt: expense.spentAt
    })),
    anomalies: []
  };
}
```

- [ ] **Step 4: Implement chat API route**

`app/api/ai/chat+api.ts`:

```ts
import { env } from "../../../src/lib/env";

export async function POST(request: Request) {
  if (!env.groq.apiKey) {
    return Response.json({ error: "GROQ_API_KEY is not configured." }, { status: 503 });
  }

  const body = await request.json();
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.groq.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.groq.model,
      messages: [
        {
          role: "system",
          content:
            "You are Penny Wise, a concise AI financial behavior coach. Analyze spending context, explain risks, and give practical next steps. Do not provide investment, legal, or tax advice."
        },
        {
          role: "user",
          content: JSON.stringify(body)
        }
      ],
      temperature: 0.4
    })
  });

  if (!response.ok) {
    return Response.json({ error: "Groq request failed." }, { status: response.status });
  }

  const data = await response.json();
  return Response.json({
    message: data.choices?.[0]?.message?.content ?? "I could not generate a response.",
    widgets: []
  });
}
```

- [ ] **Step 5: Run AI context test and typecheck**

```bash
npm run test -- __tests__/ai-context.test.ts
npm run typecheck
```

Expected: PASS.

---

### Task 8: Auth, App Guards, And Onboarding Screens

**Files:**
- Modify: `app/_layout.tsx`
- Create: `app/(auth)/_layout.tsx`
- Create: `app/(auth)/sign-in.tsx`
- Create: `app/(auth)/sign-up.tsx`
- Create: `app/(auth)/verify.tsx`
- Create: `app/onboarding/index.tsx`
- Create: `src/features/auth/store.ts`
- Create: `src/components/ui/Screen.tsx`
- Create: `src/components/ui/GradientButton.tsx`

- [ ] **Step 1: Build UI primitives**

Create `Screen` and `GradientButton` components matching the dark theme.

- [ ] **Step 2: Wire auth subscription in root layout**

Use `subscribeToAuth` and route users to auth, onboarding, or tabs based on session and profile state.

- [ ] **Step 3: Create sign-in and sign-up screens**

Use email/password forms, validation messages, and Firebase auth wrappers.

- [ ] **Step 4: Create onboarding screen**

Use the Replit onboarding blueprint: AI coach positioning, dark card visuals, and a completion action that stores onboarding status.

- [ ] **Step 5: Verify auth route typecheck**

```bash
npm run typecheck
```

Expected: PASS.

---

### Task 9: Dashboard, Add Expense, Activity, And Edit Expense

**Files:**
- Create: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/index.tsx`
- Create: `app/(tabs)/activity.tsx`
- Create: `app/expense/new.tsx`
- Create: `app/expense/[id].tsx`
- Create: `src/components/ui/GlassCard.tsx`
- Create: `src/components/ui/IconButton.tsx`
- Create: `src/components/ui/MetricHero.tsx`
- Create: `src/components/ui/ExpenseRow.tsx`
- Create: `src/components/ui/CategoryPill.tsx`

- [ ] **Step 1: Implement tab layout**

Create five tabs: dashboard, analytics, add action, activity, settings/coach as specified by the design. Use lucide icons and a center add button.

- [ ] **Step 2: Implement dashboard screen**

Translate the Replit dashboard to native: greeting header, monthly total, health badge, mini chart, category cards, quick actions, AI insights, recent expenses.

- [ ] **Step 3: Implement add expense sheet screen**

Create a bottom-sheet styled route with amount input, category selector, note/date/recurring fields, and save action through `useExpenseStore`.

- [ ] **Step 4: Implement activity list**

Add chronological expense list with filters for date/category/amount and edit navigation.

- [ ] **Step 5: Implement edit/delete route**

Allow editing existing expense fields and deleting through repository/store actions.

- [ ] **Step 6: Verify screens**

```bash
npm run typecheck
```

Expected: PASS.

---

### Task 10: Analytics And Charts

**Files:**
- Create: `app/(tabs)/analytics.tsx`
- Create: `src/components/charts/SpendingLineChart.tsx`
- Create: `src/components/charts/CategoryDonutChart.tsx`
- Create: `src/components/ui/BudgetProgress.tsx`
- Create: `src/components/ui/SegmentedControl.tsx`

- [ ] **Step 1: Build chart wrappers**

Create presentation-only chart components using `victory-native` and `react-native-svg`.

- [ ] **Step 2: Build analytics screen**

Translate the Replit analytics screen: week/month/year segmented control, total, comparison badge, line chart, projected end-of-month card, category donut/breakdown.

- [ ] **Step 3: Verify analytics behavior**

```bash
npm run test -- __tests__/analytics.test.ts
npm run typecheck
```

Expected: PASS.

---

### Task 11: AI Coach Chat And Insight Cards

**Files:**
- Create: `app/(tabs)/coach.tsx`
- Create: `src/components/ui/ChatBubble.tsx`
- Create: `src/components/ui/CoachWidget.tsx`
- Create: `src/components/ui/InsightCard.tsx`
- Modify: `app/(tabs)/index.tsx`
- Modify: `src/features/coach/store.ts`

- [ ] **Step 1: Implement coach store**

Store local chat messages, pending state, errors, and send requests to `/api/ai/chat`.

- [ ] **Step 2: Implement AI chat screen**

Translate the Replit AI chat screen: assistant header, message bubbles, suggestion chips, input bar, microphone affordance, and retry state.

- [ ] **Step 3: Implement insight cards**

Render generated or locally derived insights on the dashboard. If Groq is unavailable, show deterministic budget and trend insights from selectors.

- [ ] **Step 4: Verify AI boundary**

```bash
npm run test -- __tests__/ai-context.test.ts
npm run typecheck
```

Expected: PASS.

---

### Task 12: Settings, README, And Final Verification

**Files:**
- Create: `app/(tabs)/settings.tsx`
- Modify: `README.md`
- Modify: `.gitignore`

- [ ] **Step 1: Implement settings**

Add profile summary, currency setting, AI tone selector, Firebase env status, and sign out.

- [ ] **Step 2: Document setup**

`README.md` must include:

```md
# Penny Wise Mobile App

## Setup

1. Copy `.env.example` to `.env`.
2. Create a Firebase project and enable Email/Password auth.
3. Create Firestore in test mode for local development.
4. Fill the Firebase `EXPO_PUBLIC_*` values.
5. Create a Groq API key and set `GROQ_API_KEY`.
6. Run `npm install`.
7. Run `npx expo start --clear`.
```

- [ ] **Step 3: Ignore secrets**

`.gitignore` must include:

```gitignore
.env
.env.local
```

- [ ] **Step 4: Full verification**

Run:

```bash
npm run test
npm run typecheck
npm run lint
npx expo start --clear
```

Expected: tests, typecheck, and lint pass. Expo starts and shows the app QR/dev server. Stop the dev server after confirming it starts unless the user asks to keep it running.

---

## Self-Review

- Spec coverage: The plan covers Expo SDK 55 scaffold, NativeWind, Firebase Auth/Firestore, Groq API boundary, Zustand, analytics, dashboard, add/edit expenses, activity, AI coach, settings, `.env.example`, and verification.
- Scope fit: Voice, OCR, push notifications, and advanced anomaly modeling remain visible affordances/service boundaries, matching the approved design.
- Placeholder scan: No task depends on unspecified credentials. `.env.example` is explicit and development failures should explain missing values.
- Type consistency: Expense, analytics, coach context, and store APIs use the same property names across tasks.
