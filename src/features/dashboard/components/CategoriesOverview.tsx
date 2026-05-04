import { ScrollView, Text, View } from "react-native";
import { dashboardStyles as styles } from "../styles";

import { BudgetProgress } from "@/components/ui/BudgetProgress";
import { GlassCard } from "@/components/ui/GlassCard";
import { getCategory } from "@/constants/categories";
import {
    calculateCategoryTotals
} from "@/features/analytics/selectors";
import { useExpenseStore } from "@/features/expenses/hooks";
import { useSettingsStore } from "@/features/settings/store";

export default function CategoriesOverview() {
    const expenses = useExpenseStore((state) => state.expenses);
    const currency = useSettingsStore((state) => state.currency);

    const currentDate = new Date();
    const categories = calculateCategoryTotals(expenses, currentDate);

    return (
        <>
            {categories.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryRow}
                >
                    {categories.map((item) => {
                        const category = getCategory(item.categoryId);
                        const Icon = category.icon;

                        return (
                            <GlassCard key={item.categoryId} style={styles.categoryCard}>
                                <View style={styles.categoryNameContainer}>
                                    <View
                                        style={[
                                            styles.categoryIcon,
                                            {
                                                backgroundColor: `${category.color}1F`,
                                                borderColor: `${category.color}55`,
                                            },
                                        ]}
                                    >
                                        <Icon size={12} color={category.color} />
                                    </View>
                                    <Text style={styles.categoryName} numberOfLines={1}>
                                        {category.name}
                                    </Text>
                                </View>
                                <Text style={styles.categoryAmount}>
                                    {currency}
                                    {item.total.toLocaleString("en-IN")}
                                </Text>
                                <BudgetProgress
                                    label=""
                                    percentage={item.percentage}
                                    color={category.color}
                                />
                            </GlassCard>
                        );
                    })}
                </ScrollView>
            )}
        </>
    );
}
