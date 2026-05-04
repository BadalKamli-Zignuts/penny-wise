import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { GradientButton } from "@/components/ui/GradientButton";
import { Screen } from "@/components/ui/Screen";
import { useAuthStore } from "@/features/auth/store";
import { useExpenseStore } from "@/features/expenses/hooks";
import { colors } from "@/theme/colors";

export default function EditExpenseScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const user = useAuthStore((state) => state.user);
    const expense = useExpenseStore((state) =>
        state.expenses.find((item) => item.id === id),
    );
    const deleteExpense = useExpenseStore((state) => state.deleteExpense);

    return (
        <Screen scroll={false} style={styles.screen}>
            <Text style={styles.title}>{expense?.merchant ?? "Expense"}</Text>
            <Text style={styles.subtitle}>
                Edit forms are wired through the same store boundary. Delete is
                available now.
            </Text>
            <GradientButton
                label="Delete expense"
                onPress={async () => {
                    if (id && user) {
                        await deleteExpense(user.uid, id);
                        router.back();
                    }
                }}
            />
            <Text style={styles.cancel} onPress={() => router.back()}>
                Cancel
            </Text>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: { justifyContent: "center" },
    title: { color: colors.primaryText, fontSize: 34, fontWeight: "900" },
    subtitle: { color: colors.secondaryText, fontSize: 16, lineHeight: 23 },
    cancel: {
        color: colors.secondaryText,
        textAlign: "center",
        fontWeight: "800",
    },
});
