import { TrendingDown, TrendingUp } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useAuthStore } from "@/features/auth/store";
import {
    useBudgetStore,
    useBudgetsWithSpending,
} from "@/features/budgets/hooks/useBudgetsWithSpending";
import { useExpenseStore } from "@/features/expenses/hooks";
import { useSettingsStore } from "@/features/settings/store";
import { colors } from "@/theme/colors";
import { AddBudgetModal } from "../components/AddBudgetModel";
import { AddIncomeModal } from "../components/AddIncomeModal";
import { BudgetList } from "../components/BudgetList";
import { BudgetOverview } from "../components/BudgetOverview";
import { IncomeList } from "../components/IncomeList";
import { IncomeOverview } from "../components/IncomeOverview";
import { screenStyles as s } from "../styles";

type TabType = "budgets" | "income";

export default function BudgetIncomeScreen() {
    const user = useAuthStore((s) => s.user);
    const currency = useSettingsStore((s) => s.currency);
    const budgets = useBudgetsWithSpending();
    const expenses = useExpenseStore((s) => s.expenses);
    const addExpense = useExpenseStore((s) => s.addExpense);

    const [activeTab, setActiveTab] = useState<TabType>("budgets");
    const [showAddBudget, setShowAddBudget] = useState(false);
    const [showAddIncome, setShowAddIncome] = useState(false);

    // Calculate total income this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const incomeExpenses = expenses.filter(
        (e) => e.categoryId === "income" && new Date(e.spentAt) >= monthStart,
    );
    const totalIncome = incomeExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate total budget and spending
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const budgetRemaining = totalBudget - totalSpent;

    return (
        <View style={s.safe}>
            {/* Tabs */}
            <View style={s.tabs}>
                <Pressable
                    style={[s.tab, activeTab === "budgets" && s.tabActive]}
                    onPress={() => setActiveTab("budgets")}
                >
                    <TrendingDown
                        size={20}
                        color={
                            activeTab === "budgets"
                                ? colors.primaryText
                                : colors.secondaryText
                        }
                    />
                    <Text style={[s.tabText, activeTab === "budgets" && s.tabTextActive]}>
                        Budgets
                    </Text>
                </Pressable>
                <Pressable
                    style={[s.tab, activeTab === "income" && s.tabActive]}
                    onPress={() => setActiveTab("income")}
                >
                    <TrendingUp
                        size={20}
                        color={
                            activeTab === "income" ? colors.primaryText : colors.secondaryText
                        }
                    />
                    <Text style={[s.tabText, activeTab === "income" && s.tabTextActive]}>
                        Income
                    </Text>
                </Pressable>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.scroll}
            >
                {activeTab === "budgets" ? (
                    <>
                        <BudgetOverview
                            currency={currency}
                            totalBudget={totalBudget}
                            totalSpent={totalSpent}
                            budgetRemaining={budgetRemaining}
                        />

                        <BudgetList
                            budgets={budgets}
                            currency={currency}
                            onAddBudget={() => setShowAddBudget(true)}
                        />
                    </>
                ) : (
                    <>
                        <IncomeOverview currency={currency} totalIncome={totalIncome} />

                        <IncomeList
                            incomeExpenses={incomeExpenses}
                            currency={currency}
                            onAddIncome={() => setShowAddIncome(true)}
                        />
                    </>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Add Budget Modal */}
            <AddBudgetModal
                visible={showAddBudget}
                onClose={() => setShowAddBudget(false)}
                onAdd={async (categoryId, amount) => {
                    if (!user) return;
                    const now = new Date();
                    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

                    await useBudgetStore.getState().addBudget(user.uid, {
                        categoryId,
                        amount,
                        currency,
                        period: "monthly",
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                    });
                    setShowAddBudget(false);
                }}
            />

            {/* Add Income Modal */}
            <AddIncomeModal
                visible={showAddIncome}
                onClose={() => setShowAddIncome(false)}
                onAdd={async (amount, source, date) => {
                    if (!user) return;
                    await addExpense(user.uid, {
                        amount,
                        currency,
                        categoryId: "income",
                        merchant: source,
                        note: "",
                        recurring: false,
                        spentAt: date.toISOString(),
                    });
                    setShowAddIncome(false);
                }}
            />
        </View>
    );
}
