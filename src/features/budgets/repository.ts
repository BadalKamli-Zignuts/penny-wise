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
import type { Budget, NewBudget } from "./types";

function budgetsCollection(userId: string) {
  return collection(firestore, "users", userId, "budgets");
}

export function subscribeToBudgets(userId: string, callback: (budgets: Budget[]) => void) {
  const q = query(budgetsCollection(userId), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const budgets = snapshot.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          ...data,
          startDate: data.startDate?.toDate?.()?.toISOString() || data.startDate,
          endDate: data.endDate?.toDate?.()?.toISOString() || data.endDate,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        } as Budget;
      });
      callback(budgets);
    },
    (error) => {
      console.error("Error subscribing to budgets:", error);
      callback([]);
    }
  );
}

export async function createBudget(userId: string, budget: NewBudget) {
  const docRef = await addDoc(budgetsCollection(userId), {
    ...budget,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: docRef.id };
}

export async function updateBudget(userId: string, budgetId: string, budget: Partial<Budget>) {
  await updateDoc(doc(firestore, "users", userId, "budgets", budgetId), {
    ...budget,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBudget(userId: string, budgetId: string) {
  await deleteDoc(doc(firestore, "users", userId, "budgets", budgetId));
}
