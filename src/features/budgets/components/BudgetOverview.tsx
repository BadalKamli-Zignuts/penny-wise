import { Text, View } from "react-native";

import { GlassCard } from "@/components/ui/GlassCard";
import { colors } from "@/theme/colors";
import { screenStyles as s } from "../styles";

type Props = {
    currency: string;
    totalBudget: number;
    totalSpent: number;
    budgetRemaining: number;
};

export function BudgetOverview({
    currency,
    totalBudget,
    totalSpent,
    budgetRemaining,
}: Props) {
    return (
        <GlassCard style={s.overviewCard}>
            <View style={s.overviewRow}>
                <View style={s.overviewItem}>
                    <Text style={s.overviewLabel}>Total Budget</Text>
                    <Text style={s.overviewAmount}>
                        {currency}
                        {totalBudget.toLocaleString("en-IN")}
                    </Text>
                </View>

                <View style={s.overviewDivider} />

                <View style={s.overviewItem}>
                    <Text style={s.overviewLabel}>Spent</Text>
                    <Text style={[s.overviewAmount, { color: colors.coral }]}>
                        {currency}
                        {totalSpent.toLocaleString("en-IN")}
                    </Text>
                </View>

                <View style={s.overviewDivider} />

                <View style={s.overviewItem}>
                    <Text style={s.overviewLabel}>Remaining</Text>
                    <Text
                        style={[
                            s.overviewAmount,
                            {
                                color:
                                    budgetRemaining >= 0
                                        ? colors.mint
                                        : colors.coral,
                            },
                        ]}
                    >
                        {currency}
                        {Math.abs(budgetRemaining).toLocaleString("en-IN")}
                    </Text>
                </View>
            </View>
        </GlassCard>
    );
}