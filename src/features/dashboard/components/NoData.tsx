import { router } from "expo-router";
import {
    Sparkles
} from "lucide-react-native";
import {
    Text,
    View
} from "react-native";
import { dashboardStyles as styles } from "../styles";

import { GradientButton } from "@/components/ui/GradientButton";
import { colors } from "@/theme/colors";

export const NoData = () => {
    return (
        <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
                <Sparkles size={48} color={colors.violet} />
            </View>
            <Text style={styles.emptyTitle}>Start tracking your expenses</Text>
            <Text style={styles.emptyBody}>
                Add your first expense to unlock AI-powered insights, budgets, and
                spending analytics.
            </Text>
            <GradientButton
                label="Add First Expense"
                onPress={() => router.push("/expense/new")}
            />
            <Text style={styles.emptyHint}>
                Or explore the app with sample data from Settings
            </Text>
        </View>
    );
}