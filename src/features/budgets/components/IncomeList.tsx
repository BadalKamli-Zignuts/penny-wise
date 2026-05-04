import { Plus, TrendingUp } from "lucide-react-native";
import {
    Pressable,
    Text,
    View,
} from "react-native";

import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { colors } from "@/theme/colors";
import { screenStyles as s } from "../styles";

type Props = {
    incomeExpenses: Array<{
        id: string;
        amount: number;
        merchant: string;
        spentAt: string;
    }>;
    currency: string;
    onAddIncome: () => void;
};

export function IncomeList({
    incomeExpenses,
    currency,
    onAddIncome,
}: Props) {
    return (
        <View style={s.section}>
            <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>
                    Income Entries
                </Text>

                <Pressable
                    style={s.addBtn}
                    onPress={onAddIncome}
                >
                    <Plus
                        size={18}
                        color={colors.mint}
                    />

                    <Text
                        style={[
                            s.addBtnText,
                            { color: colors.mint },
                        ]}
                    >
                        Add Income
                    </Text>
                </Pressable>
            </View>

            {incomeExpenses.length === 0 ? (
                <GlassCard style={s.emptyCard}>
                    <Text style={s.emptyTitle}>
                        No income recorded
                    </Text>

                    <Text style={s.emptyBody}>
                        Track your income sources to get
                        a complete financial picture
                    </Text>

                    <GradientButton
                        label="Add First Income"
                        onPress={onAddIncome}
                    />
                </GlassCard>
            ) : (
                incomeExpenses.map((income) => (
                    <GlassCard
                        key={income.id}
                        style={s.incomeCard}
                    >
                        <View style={s.incomeRow}>
                            <View
                                style={[
                                    s.incomeIconSmall,
                                    {
                                        backgroundColor: `${colors.mint}1F`,
                                    },
                                ]}
                            >
                                <TrendingUp
                                    size={18}
                                    color={colors.mint}
                                />
                            </View>

                            <View style={s.incomeMeta}>
                                <Text style={s.incomeName}>
                                    {income.merchant}
                                </Text>

                                <Text style={s.incomeDate}>
                                    {new Date(
                                        income.spentAt,
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        },
                                    )}
                                </Text>
                            </View>

                            <Text
                                style={[
                                    s.incomeAmount,
                                    { color: colors.mint },
                                ]}
                            >
                                +{currency}
                                {income.amount.toLocaleString(
                                    "en-IN",
                                )}
                            </Text>
                        </View>
                    </GlassCard>
                ))
            )}
        </View>
    );
}