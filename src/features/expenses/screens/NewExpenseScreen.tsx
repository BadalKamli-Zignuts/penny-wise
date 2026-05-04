import { router, useLocalSearchParams } from "expo-router";
import { Calendar, FileText, Mic } from "lucide-react-native";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    View
} from "react-native";

import { AIAnalysisAnimation } from "@/components/ui/AIAnalysisAnimation";
import { GradientButton } from "@/components/ui/GradientButton";
import { useAuthStore } from "@/features/auth/store";
import { useCreateExpense } from "@/features/expenses/hooks";
import type { ExpenseCategoryId } from "@/features/expenses/types";
import { useSettingsStore } from "@/features/settings/store";
import { colors } from "@/theme/colors";
import CategoryList from "../components/CategoryList";
import { styles } from "../styles";

export default function NewExpenseScreen() {
    const { date: dateParam } = useLocalSearchParams<{ date?: string }>();
    const user = useAuthStore((state) => state.user);
    const currency = useSettingsStore((state) => state.currency);

    const [amount, setAmount] = useState("100");
    const [categoryId, setCategoryId] = useState<ExpenseCategoryId>("food");
    const [merchant, setMerchant] = useState("Lunch");
    const [note, setNote] = useState("");
    const [recurring, setRecurring] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);

    const expenseDate = dateParam ? new Date(dateParam) : new Date();

    const { createExpense, error, loading } = useCreateExpense({ user, currency });

    const handleSaveExpense = async () => {
        const success = await createExpense({
            amount,
            categoryId,
            merchant,
            note,
            recurring,
            spentAt: expenseDate
        });

        if (success) {
            setShowAnalysis(true);
        }
    }

    function handleAnalysisComplete() {
        setShowAnalysis(false);
        router.back();
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.screen}
        >
            <AIAnalysisAnimation
                visible={showAnalysis}
                onComplete={handleAnalysisComplete}
            />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.sheet}>
                    <View style={styles.handle} />
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Expense</Text>
                    </View>
                    <View style={styles.amountWrap}>
                        <Text style={styles.currency}>{currency}</Text>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="decimal-pad"
                            style={styles.amount}
                        />
                    </View>
                    {dateParam && (
                        <Text style={styles.dateInfo}>
                            {expenseDate.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </Text>
                    )}
                    <CategoryList categoryId={categoryId} onChange={setCategoryId} />
                    <View style={styles.field}>
                        <FileText size={18} color={colors.secondaryText} />
                        <TextInput
                            value={merchant}
                            onChangeText={setMerchant}
                            placeholder="Merchant"
                            placeholderTextColor={colors.secondaryText}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.field}>
                        <Calendar size={18} color={colors.secondaryText} />
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            placeholder="Add note"
                            placeholderTextColor={colors.secondaryText}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.toggle}>
                        <View style={styles.toggleContainer}>
                            <Text style={styles.toggleText}>Recurring</Text>
                            <Switch value={recurring} onValueChange={setRecurring} />
                        </View>
                    </View>
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <GradientButton
                        label={loading ? "Saving..." : "Save Expense"}
                        onPress={handleSaveExpense}
                        disabled={loading}
                    />
                    <View style={styles.voice}>
                        <Mic size={16} color={colors.secondaryText} />
                        <Text style={styles.voiceText}>Use voice instead</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
