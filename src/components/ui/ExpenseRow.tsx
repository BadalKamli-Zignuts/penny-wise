import { StyleSheet, Text, View } from "react-native";

import { getCategory } from "@/constants/categories";
import type { Expense } from "../../features/expenses/types";
import { formatMoney } from "../../lib/money";
import { colors } from "../../theme/colors";

export function ExpenseRow({ expense }: { expense: Expense }) {
  const category = getCategory(expense.categoryId);
  const Icon = category.icon;

  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: `${category.color}1F`, borderColor: `${category.color}55` }]}>
        <Icon size={19} color={category.color} />
      </View>
      <View style={styles.meta}>
        <Text style={styles.merchant} numberOfLines={1}>
          {expense.merchant || category.name}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {category.name} · {new Date(expense.spentAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </Text>
      </View>
      <Text style={[styles.amount, expense.categoryId === "income" && styles.amountIncome]}>
        {expense.categoryId === "income" ? "+" : "-"}{formatMoney(expense.amount, expense.currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  meta: {
    flex: 1,
    gap: 3,
  },
  merchant: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: "700",
  },
  sub: {
    color: colors.secondaryText,
    fontSize: 12,
  },
  amount: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: "800",
  },
  amountIncome: {
    color: colors.mint,
  },
});
