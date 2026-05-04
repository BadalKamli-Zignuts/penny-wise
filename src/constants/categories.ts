import {
  Banknote,
  Car,
  HeartPulse,
  Home,
  Plane,
  Receipt,
  ShoppingBag,
  Utensils,
  Wallet,
  Wifi,
} from "lucide-react-native";

import { colors } from "@/theme/colors";
import type { ExpenseCategoryId } from "../features/expenses/types";

export const CATEGORIES: {
  id: ExpenseCategoryId;
  name: string;
  icon: typeof Utensils;
  color: string;
  monthlyBudget: number;
}[] = [
  {
    id: "food",
    name: "Food",
    icon: Utensils,
    color: colors.violet,
    monthlyBudget: 12000,
  },
  {
    id: "transport",
    name: "Transit",
    icon: Car,
    color: colors.cyan,
    monthlyBudget: 6000,
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: ShoppingBag,
    color: colors.coral,
    monthlyBudget: 9000,
  },
  {
    id: "bills",
    name: "Bills",
    icon: Receipt,
    color: colors.amber,
    monthlyBudget: 10000,
  },
  {
    id: "housing",
    name: "Housing",
    icon: Home,
    color: colors.indigo,
    monthlyBudget: 30000,
  },
  {
    id: "subscriptions",
    name: "Subs",
    icon: Wifi,
    color: colors.coral,
    monthlyBudget: 3000,
  },
  {
    id: "travel",
    name: "Travel",
    icon: Plane,
    color: colors.cyan,
    monthlyBudget: 15000,
  },
  {
    id: "health",
    name: "Health",
    icon: HeartPulse,
    color: colors.mint,
    monthlyBudget: 5000,
  },
  {
    id: "income",
    name: "Income",
    icon: Banknote,
    color: colors.mint,
    monthlyBudget: 0,
  },
  {
    id: "other",
    name: "Other",
    icon: Wallet,
    color: colors.secondaryText,
    monthlyBudget: 5000,
  },
];

export function getCategory(id: ExpenseCategoryId) {
  return (
    CATEGORIES.find((category) => category.id === id) ??
    CATEGORIES[CATEGORIES.length - 1]
  );
}
