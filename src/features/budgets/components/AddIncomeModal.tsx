import { useState } from "react";
import {
    Modal,
    Pressable,
    Text,
    TextInput,
    View
} from "react-native";

import { GradientButton } from "@/components/ui/GradientButton";
import { useSettingsStore } from "@/features/settings/store";
import { colors } from "@/theme/colors";
import { modalStyles as m } from "../styles";

export function AddIncomeModal({
    visible,
    onClose,
    onAdd,
}: {
    visible: boolean;
    onClose: () => void;
    onAdd: (amount: number, source: string, date: Date) => Promise<void>;
}) {
    const currency = useSettingsStore((s) => s.currency);
    const [amount, setAmount] = useState("");
    const [source, setSource] = useState("");

    async function handleAdd() {
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0 || !source.trim()) return;

        await onAdd(amountNum, source.trim(), new Date());
        setAmount("");
        setSource("");
    }

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={m.overlay}>
                <Pressable style={m.backdrop} onPress={onClose} />
                <View style={m.modal}>
                    <View style={m.handle} />
                    <Text style={m.modalTitle}>Add Income</Text>

                    <View style={m.amountWrap}>
                        <Text style={m.currency}>{currency}</Text>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="decimal-pad"
                            placeholder="0"
                            placeholderTextColor={colors.secondaryText}
                            style={m.amountInput}
                        />
                    </View>

                    <View style={m.field}>
                        <TextInput
                            value={source}
                            onChangeText={setSource}
                            placeholder="Income source (e.g., Salary, Freelance)"
                            placeholderTextColor={colors.secondaryText}
                            style={m.input}
                        />
                    </View>

                    <GradientButton label="Add Income" onPress={handleAdd} />
                    <Pressable onPress={onClose}>
                        <Text style={m.cancel}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

