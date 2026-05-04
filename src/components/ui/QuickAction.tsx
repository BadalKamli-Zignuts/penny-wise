import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { colors } from "@/theme/colors";

export function QuickAction({
    icon: Icon,
    label,
    active = false,
    onPress,
}: {
    icon: any;
    label: string;
    active?: boolean;
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity style={styles.quickAction} onPress={onPress}>
            <View style={[styles.quickIcon, active && styles.quickIconActive]}>
                <Icon
                    size={22}
                    color={active ? colors.primaryText : colors.secondaryText}
                />
            </View>
            <Text style={[styles.quickLabel, active && styles.quickLabelActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    quickAction: { alignItems: "center", gap: 8 },
    quickIcon: {
        width: 56,
        height: 56,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardSoft,
        alignItems: "center",
        justifyContent: "center",
    },
    quickIconActive: { backgroundColor: colors.violet },
    quickLabel: { color: colors.secondaryText, fontSize: 12, fontWeight: "800" },
    quickLabelActive: { color: colors.primaryText },
})