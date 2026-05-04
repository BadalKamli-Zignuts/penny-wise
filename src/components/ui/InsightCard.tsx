import { Bell, Sparkles } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { GlassCard } from "./GlassCard";
import { colors } from "../../theme/colors";

export function InsightCard({ title, body, kind = "spark" }: { title: string; body: string; kind?: "spark" | "alert" }) {
  const Icon = kind === "spark" ? Sparkles : Bell;

  return (
    <GlassCard style={styles.card}>
      <View style={styles.iconWrap}>
        <Icon size={16} color={colors.primaryText} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    padding: 18,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    gap: 5,
  },
  title: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: "800",
  },
  body: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 20,
  },
});
