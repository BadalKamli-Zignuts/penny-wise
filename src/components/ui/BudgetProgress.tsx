import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";

export function BudgetProgress({ label, percentage, color = colors.violet }: { label: string; percentage: number; color?: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(percentage)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(percentage, 100)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: colors.primaryText,
    fontSize: 13,
    fontWeight: "700",
  },
  value: {
    color: colors.secondaryText,
    fontSize: 12,
    fontWeight: "700",
  },
  track: {
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
