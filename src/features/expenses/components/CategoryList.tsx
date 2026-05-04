import { Pressable, StyleSheet, Text, View } from "react-native";

import { CATEGORIES } from "@/constants/categories";
import { colors } from "@/theme/colors";
import { ExpenseCategoryId } from "../types";

export default function CategoryList({ categoryId, onChange }: { categoryId: ExpenseCategoryId; onChange: (categoryId: ExpenseCategoryId) => void }) {

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categories}>
                {CATEGORIES.slice(0, 8).map((category) => {
                    const Icon = category.icon;
                    const active = category.id === categoryId;

                    return (
                        <Pressable
                            key={category.id}
                            style={styles.category}
                            onPress={() => onChange(category.id)}
                        >
                            <View
                                style={[
                                    styles.categoryIcon,
                                    active && {
                                        borderColor: category.color,
                                        backgroundColor: `${category.color}1F`,
                                    },
                                ]}
                            >
                                <Icon
                                    size={22}
                                    color={active ? category.color : colors.secondaryText}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.categoryLabel,
                                    active && styles.categoryLabelActive,
                                ]}
                            >
                                {category.name}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12
    },
    categories: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
        flexWrap: "wrap",
    },
    label: {
        color: colors.secondaryText,
        fontSize: 12,
        fontWeight: "900",
        textTransform: "uppercase",
    },
    category: { alignItems: "center", gap: 6, width: 68 },
    categoryIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardSoft,
        alignItems: "center",
        justifyContent: "center",
    },
    categoryLabel: {
        color: colors.secondaryText,
        fontSize: 11,
        fontWeight: "800",
    },
    categoryLabelActive: { color: colors.primaryText },
});
