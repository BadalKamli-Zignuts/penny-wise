import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { dashboardStyles as styles } from "../styles";

import { ExpenseRow } from "@/components/ui/ExpenseRow";
import { GlassCard } from "@/components/ui/GlassCard";
import { useExpenseStore } from "@/features/expenses/hooks";
import { colors } from "@/theme/colors";

export const RecentExpensesSection = () => {
    const expenses = useExpenseStore((state) => state.expenses);

    return (
        <>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent expenses</Text>
                <Pressable
                    style={styles.viewAllBtn}
                    onPress={() => router.push("/activity")}
                >
                    <Text style={styles.viewAllText}>View all</Text>
                    <ChevronRight size={15} color={colors.violet} />
                </Pressable>
            </View>
            <GlassCard style={styles.expensesCard}>
                {expenses.slice(0, 4).map((expense) => (
                    <ExpenseRow key={expense.id} expense={expense} />
                ))}
            </GlassCard>
        </>
    );
};
