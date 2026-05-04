import { Period } from "@/features/analytics/types";
import { colors } from "@/theme/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    value: Period;
    onChange: (period: Period) => void;
};

export function PeriodSelector({ value, onChange }: Props) {
    return (
        <View style={styles.segment}>
            <Pressable onPress={() => onChange("week")}>
                <Text
                    style={[
                        styles.segmentText,
                        value === "week" && styles.segmentTextActive,
                    ]}
                >
                    Week
                </Text>
            </Pressable>

            <View
                style={value === "month" ? styles.segmentActiveWrap : undefined}
            >
                <Pressable onPress={() => onChange("month")}>
                    <Text
                        style={[
                            styles.segmentText,
                            value === "month" && styles.segmentActive,
                        ]}
                    >
                        Month
                    </Text>
                </Pressable>
            </View>

            <Pressable onPress={() => onChange("year")}>
                <Text
                    style={[
                        styles.segmentText,
                        value === "year" && styles.segmentTextActive,
                    ]}
                >
                    Year
                </Text>
            </Pressable>
        </View>
    );
}


export const styles = StyleSheet.create({
    segment: {
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.03)",
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 999,
        padding: 4,
    },
    segmentText: {
        color: colors.secondaryText,
        fontSize: 13,
        fontWeight: "800",
        paddingHorizontal: 18,
        paddingVertical: 8,
    },
    segmentTextActive: { color: colors.primaryText },
    segmentActiveWrap: { backgroundColor: colors.primaryText, borderRadius: 999 },
    segmentActive: { color: colors.bg },
});
