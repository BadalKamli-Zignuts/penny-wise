import { Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { getCategory } from "@/constants/categories";
import { colors } from "@/theme/colors";
import { screenStyles as s } from "../styles";

type Props = {
    budgets: any[];
    currency: string;
    onAddBudget: () => void;
};

export function BudgetList({
    budgets,
    currency,
    onAddBudget,
}: Props) {
    return (
        <View style={s.section}>
            <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>Category Budgets</Text>

                <Pressable
                    style={s.addBtn}
                    onPress={onAddBudget}
                >
                    <Plus size={18} color={colors.violet} />
                    <Text style={s.addBtnText}>Add Budget</Text>
                </Pressable>
            </View>

            {budgets.length === 0 ? (
                <GlassCard style={s.emptyCard}>
                    <Text style={s.emptyTitle}>No budgets set</Text>

                    <Text style={s.emptyBody}>
                        Set budgets for different categories
                        to track your spending
                    </Text>

                    <GradientButton
                        label="Set First Budget"
                        onPress={onAddBudget}
                    />
                </GlassCard>
            ) : (
                budgets.map((budget) => {
                    const cat = getCategory(budget.categoryId);
                    const Icon = cat.icon;

                    return (
                        <GlassCard
                            key={budget.id}
                            style={s.budgetCard}
                        >
                            {/* existing card UI */}
                        </GlassCard>
                    );
                })
            )}
        </View>
    );
}