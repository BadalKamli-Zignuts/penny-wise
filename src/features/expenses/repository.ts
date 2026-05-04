import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import { firestore } from "../../lib/firebase/config";
import type { Expense, NewExpense } from "./types";

function expensesCollection(userId: string) {
  return collection(firestore, "users", userId, "expenses");
}

export function subscribeToExpenses(userId: string, callback: (expenses: Expense[]) => void) {
  const q = query(expensesCollection(userId), orderBy("spentAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const expenses = snapshot.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          ...data,
          // Convert Firestore Timestamps to ISO strings
          spentAt: data.spentAt?.toDate?.()?.toISOString() || data.spentAt,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        } as Expense;
      });
      callback(expenses);
    },
    (error) => {
      console.error("Error subscribing to expenses:", error);
      callback([]);
    }
  );
}

export async function createExpense(userId: string, expense: NewExpense) {
  const docRef = await addDoc(expensesCollection(userId), {
    ...expense,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: docRef.id };
}

export async function updateExpense(userId: string, expenseId: string, expense: Partial<Expense>) {
  await updateDoc(doc(firestore, "users", userId, "expenses", expenseId), {
    ...expense,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteExpense(userId: string, expenseId: string) {
  await deleteDoc(doc(firestore, "users", userId, "expenses", expenseId));
}
