import { router } from "expo-router";
import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { dashboardStyles as styles } from "../styles";

import { GlassCard } from "@/components/ui/GlassCard";
import { useBudgetsWithSpending } from "@/features/budgets/hooks/useBudgetsWithSpending";
import { useExpenseStore } from "@/features/expenses/hooks";
import { useSettingsStore } from "@/features/settings/store";
import { colors } from "@/theme/colors";

export const BudgetIncomeSection = () => {
    const expenses = useExpenseStore((state) => state.expenses);
    const currency = useSettingsStore((state) => state.currency);
    const budgets = useBudgetsWithSpending();

    // Calculate income for this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const incomeExpenses = expenses.filter(
        (e) => e.categoryId === "income" && new Date(e.spentAt) >= monthStart,
    );
    const totalIncome = incomeExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate total budget
    const totalBudget = budgets.reduce((sum: number, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum: number, b) => sum + b.spent, 0);

    return (
        <>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Budget & Income</Text>
                <Pressable
                    style={styles.viewAllBtn}
                    onPress={() => router.push("/budget-income")}
                >
                    <Text style={styles.viewAllText}>Manage</Text>
                    <ChevronRight size={15} color={colors.violet} />
                </Pressable>
            </View>

            <View style={styles.budgetIncomeRow}>
                {/* Income Card */}
                <GlassCard style={styles.budgetIncomeCard}>
                    <View
                        style={[styles.biIcon, { backgroundColor: `${colors.mint}1F` }]}
                    >
                        <TrendingUp size={20} color={colors.mint} />
                    </View>
                    <Text style={styles.biLabel}>Income</Text>
                    <Text style={[styles.biAmount, { color: colors.mint }]}>
                        {currency}
                        {totalIncome.toLocaleString("en-IN")}
                    </Text>
                    <Text style={styles.biSubtext}>This month</Text>
                </GlassCard>

                {/* Budget Card */}
                <GlassCard style={styles.budgetIncomeCard}>
                    <View
                        style={[styles.biIcon, { backgroundColor: `${colors.violet}1F` }]}
                    >
                        <TrendingDown size={20} color={colors.violet} />
                    </View>
                    <Text style={styles.biLabel}>Budget</Text>
                    <Text
                        style={[
                            styles.biAmount,
                            {
                                color: totalSpent > totalBudget ? colors.coral : colors.violet,
                            },
                        ]}
                    >
                        {currency}
                        {totalBudget.toLocaleString("en-IN")}
                    </Text>
                    <Text style={styles.biSubtext}>
                        {totalBudget > 0
                            ? `${currency}${totalSpent.toLocaleString("en-IN")} spent`
                            : "Not set"}
                    </Text>
                </GlassCard>
            </View>
        </>
    );
};
