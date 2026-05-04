import { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";

import { GradientButton } from "@/components/ui/GradientButton";
import { CATEGORIES } from "@/constants/categories";
import { ExpenseCategoryId } from "@/features/expenses/types";
import { useSettingsStore } from "@/features/settings/store";
import { colors } from "@/theme/colors";
import { modalStyles as m } from "../styles";


export function AddBudgetModal({
    visible,
    onClose,
    onAdd,
}: {
    visible: boolean;
    onClose: () => void;
    onAdd: (categoryId: ExpenseCategoryId, amount: number) => Promise<void>;
}) {
    const currency = useSettingsStore((s) => s.currency);
    const [amount, setAmount] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState<ExpenseCategoryId>("food");

    async function handleAdd() {
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) return;

        await onAdd(selectedCategory, amountNum);
        setAmount("");
        setSelectedCategory("food");
    }

    // Filter out income and other categories
    const budgetCategories = CATEGORIES.filter(
        (c) => c.id !== "income" && c.id !== "other",
    );

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={m.overlay}>
                <Pressable style={m.backdrop} onPress={onClose} />
                <View style={m.modal}>
                    <View style={m.handle} />
                    <Text style={m.modalTitle}>Set Budget</Text>

                    <View style={m.amountWrap}>
                        <Text style={[m.currency, { color: colors.violet }]}>
                            {currency}
                        </Text>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="decimal-pad"
                            placeholder="0"
                            placeholderTextColor={colors.secondaryText}
                            style={m.amountInput}
                        />
                    </View>

                    <Text style={m.label}>Category</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={m.categories}
                    >
                        {budgetCategories.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = selectedCategory === cat.id;
                            return (
                                <Pressable
                                    key={cat.id}
                                    style={m.category}
                                    onPress={() => setSelectedCategory(cat.id)}
                                >
                                    <View
                                        style={[
                                            m.categoryIcon,
                                            {
                                                backgroundColor: isSelected
                                                    ? `${cat.color}1F`
                                                    : colors.cardSoft,
                                                borderColor: isSelected ? cat.color : colors.border,
                                            },
                                        ]}
                                    >
                                        <Icon
                                            size={20}
                                            color={isSelected ? cat.color : colors.secondaryText}
                                        />
                                    </View>
                                    <Text
                                        style={[
                                            m.categoryName,
                                            isSelected && { color: colors.primaryText },
                                        ]}
                                    >
                                        {cat.name}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>

                    <GradientButton label="Set Budget" onPress={handleAdd} />
                    <Pressable onPress={onClose}>
                        <Text style={m.cancel}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
