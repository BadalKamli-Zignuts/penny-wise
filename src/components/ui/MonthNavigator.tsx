import { colors } from "@/theme/colors";
import { format } from "date-fns";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    date: Date;
    onPrev: () => void;
    onNext: () => void;
    label?: string;
};

export function MonthNavigator({ date, onPrev, onNext, label }: Props) {
    return (
        <View style={styles.monthSelector}>
            <Pressable onPress={() => onPrev()}>
                <Text style={styles.navArrow}>‹</Text>
            </Pressable>
            <Text style={styles.month}>
                {label || format(date, "MMMM yyyy")}
            </Text>
            <Pressable onPress={() => onNext()}>
                <Text style={styles.navArrow}>›</Text>
            </Pressable>
        </View>
    );
}

export const styles = StyleSheet.create({
    monthSelector: { flexDirection: "row", alignItems: "center", gap: 12 },
    navArrow: {
        color: colors.primaryText,
        fontSize: 24,
        fontWeight: "700",
        paddingHorizontal: 8,
    },
    month: {
        color: colors.secondaryText,
        fontWeight: "800",
        fontSize: 14,
        minWidth: 120,
        textAlign: "center",
    },
    total: {
        color: colors.primaryText,
        fontSize: 48,
        fontWeight: "900",
        letterSpacing: -1,
    },
});
