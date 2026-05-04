import { TrendingUp } from "lucide-react-native";
import { Text, View } from "react-native";

import { GlassCard } from "@/components/ui/GlassCard";
import { colors } from "@/theme/colors";
import { screenStyles as s } from "../styles";

type Props = {
    currency: string;
    totalIncome: number;
};

export function IncomeOverview({
    currency,
    totalIncome,
}: Props) {
    return (
        <GlassCard style={s.overviewCard}>
            <View style={s.incomeHeader}>
                <View>
                    <Text style={s.overviewLabel}>
                        Total Income This Month
                    </Text>

                    <Text
                        style={[
                            s.overviewAmount,
                            {
                                color: colors.mint,
                                fontSize: 36,
                            },
                        ]}
                    >
                        {currency}
                        {totalIncome.toLocaleString("en-IN")}
                    </Text>
                </View>

                <View
                    style={[
                        s.incomeIcon,
                        {
                            backgroundColor: `${colors.mint}1F`,
                        },
                    ]}
                >
                    <TrendingUp
                        size={32}
                        color={colors.mint}
                    />
                </View>
            </View>
        </GlassCard>
    );
}