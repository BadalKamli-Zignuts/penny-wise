import { StyleSheet, Text, View } from "react-native";

import { formatMoney } from "../../lib/money";
import { colors } from "../../theme/colors";

export function MetricHero({ 
  total, 
  currency, 
  previousTotal, 
  showComparison = true,
  period = "month"
}: { 
  total: number; 
  currency: string;
  previousTotal?: number;
  showComparison?: boolean;
  period?: "week" | "month" | "year";
}) {
  const difference = previousTotal ? total - previousTotal : 0;
  const percentChange = previousTotal && previousTotal > 0 
    ? Math.abs((difference / previousTotal) * 100).toFixed(1)
    : null;

  const periodLabel = period === "week" ? "this week" : period === "year" ? "this year" : "this month";

  return (
    <View style={styles.wrap}>
      <Text style={styles.total}>{formatMoney(total, currency)}</Text>
      {showComparison && previousTotal !== undefined && difference !== 0 && (
        <Text style={styles.caption}>
          Spent {periodLabel} · {" "}
          <Text style={[styles.comparison, difference < 0 ? styles.positive : styles.negative]}>
            {difference < 0 ? "↓" : "↑"} {currency}{Math.abs(difference).toLocaleString("en-IN")}
            {percentChange && ` (${percentChange}%)`}
          </Text>
        </Text>
      )}
      {(!showComparison || previousTotal === undefined || difference === 0) && (
        <Text style={styles.caption}>Spent {periodLabel}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 10,
    paddingTop: 8,
  },
  total: {
    color: colors.primaryText,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "800",
    letterSpacing: 0,
  },
  caption: {
    color: colors.secondaryText,
    fontSize: 15,
  },
  comparison: {
    fontWeight: "700",
  },
  positive: {
    color: colors.mint,
  },
  negative: {
    color: colors.coral,
  },
});
