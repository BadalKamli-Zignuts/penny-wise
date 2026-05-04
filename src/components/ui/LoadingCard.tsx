import { colors } from "@/theme/colors";
import { Sparkles } from "lucide-react-native";
import { StyleSheet, Text } from "react-native";
import { GlassCard } from "./GlassCard";

export const LoadingCard = ({ title = "Loading...", body }: { title: string; body?: string }) => {
    return (
        <GlassCard style={s.loadingCard}>
            <Sparkles size={32} color={colors.violet} />
            <Text style={s.loadingTitle}>{title}</Text>
            {body && <Text style={s.loadingBody}>
                {body}
            </Text>}
        </GlassCard>
    );
};

const s = StyleSheet.create({
    loadingCard: { padding: 32, alignItems: "center", gap: 16, marginBottom: 20 },
    loadingTitle: { color: colors.primaryText, fontSize: 20, fontWeight: "800" },
    loadingBody: {
        color: colors.secondaryText,
        fontSize: 14,
        textAlign: "center",
        lineHeight: 21,
    },
});
