import { AlertTriangle, Lightbulb, Sparkles, TrendingUp } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { router } from "expo-router";
import { useInsights, useInsightsLoading } from "../features/insights/hooks";
import type { InsightType } from "../features/insights/types";
import { useSettingsStore } from "../features/settings/store";
import { colors } from "../theme/colors";

const KIND_META: Record<InsightType, { label: string; color: string; bg: string; icon: typeof AlertTriangle }> = {
  spending_spike: { label: "SPENDING SPIKE", color: colors.coral, bg: "rgba(251,113,133,0.12)", icon: AlertTriangle },
  savings_opportunity: { label: "SAVINGS", color: colors.mint, bg: "rgba(52,211,153,0.12)", icon: Lightbulb },
  budget_alert: { label: "BUDGET ALERT", color: colors.amber, bg: "rgba(251,191,36,0.12)", icon: AlertTriangle },
  recurring_review: { label: "REVIEW", color: colors.cyan, bg: "rgba(6,182,212,0.12)", icon: Lightbulb },
  category_trend: { label: "TREND", color: colors.cyan, bg: "rgba(6,182,212,0.12)", icon: TrendingUp },
  anomaly: { label: "ANOMALY", color: colors.coral, bg: "rgba(251,113,133,0.12)", icon: AlertTriangle },
  achievement: { label: "ACHIEVEMENT", color: colors.mint, bg: "rgba(52,211,153,0.12)", icon: TrendingUp },
};

export default function InsightsScreen() {
  const currency = useSettingsStore((s) => s.currency);
  const insights = useInsights();
  const loading = useInsightsLoading();

  if (insights.length === 0 && !loading) {
    return (
      <View style={s.safe}>
        <View style={s.empty}>
          <View style={s.emptyIcon}>
            <Lightbulb size={48} color={colors.secondaryText} />
          </View>
          <Text style={s.emptyTitle}>No insights yet</Text>
          <Text style={s.emptyBody}>
            Add some expenses and budgets to get personalized insights about your spending patterns.
          </Text>
          <GradientButton 
            label="Add First Expense" 
            onPress={() => router.push("/expense/new")} 
          />
        </View>
      </View>
    );
  }

  return (
    <View style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={s.headerInfo}>
          <Text style={s.title}>Insights</Text>
          <Text style={s.subtitle}>
            {loading ? "AI is analyzing..." : `AI-powered insights · ${insights.length} active`}
          </Text>
        </View>

        {loading && (
          <GlassCard style={s.loadingCard}>
            <Sparkles size={32} color={colors.violet} />
            <Text style={s.loadingTitle}>Analyzing your spending</Text>
            <Text style={s.loadingBody}>
              AI is reviewing your transactions, budgets, and patterns to generate personalized insights...
            </Text>
          </GlassCard>
        )}

        {insights.map((insight) => {
          const meta = KIND_META[insight.type];
          const BadgeIcon = meta.icon;

          return (
            <GlassCard key={insight.title + insight.body} style={s.card}>
              {/* Top row: badge + icon */}
              <View style={s.cardTop}>
                <View style={[s.badge, { backgroundColor: meta.bg }]}>
                  <Text style={[s.badgeText, { color: meta.color }]}>{meta.label}</Text>
                </View>
                <View style={[s.kindIcon, { backgroundColor: meta.bg }]}>
                  <BadgeIcon size={16} color={meta.color} />
                </View>
              </View>

              <Text style={s.cardTitle}>{insight.title}</Text>
              <Text style={s.cardBody}>{insight.body}</Text>

              {/* Show amount if available */}
              {insight.amount && (
                <View style={s.amountBadge}>
                  <Text style={[s.amountText, { color: meta.color }]}>
                    {currency}{Math.abs(insight.amount).toLocaleString("en-IN")}
                  </Text>
                </View>
              )}
            </GlassCard>
          );
        })}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 10, paddingBottom: 40 },
  headerInfo: { paddingTop: 12, paddingBottom: 20, gap: 4 },
  title: { color: colors.primaryText, fontSize: 34, fontWeight: "900", letterSpacing: 0 },
  subtitle: { color: colors.secondaryText, fontSize: 14 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40, gap: 16 },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  emptyTitle: { color: colors.primaryText, fontSize: 24, fontWeight: "900", textAlign: "center" },
  emptyBody: { color: colors.secondaryText, fontSize: 16, textAlign: "center", lineHeight: 24, marginBottom: 8 },
  card: { padding: 18, gap: 10, marginBottom: 14 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badge: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10 },
  badgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  kindIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  cardTitle: { color: colors.primaryText, fontSize: 18, fontWeight: "800" },
  cardBody: { color: colors.secondaryText, fontSize: 14, lineHeight: 21 },
  amountBadge: { alignSelf: "flex-start", backgroundColor: colors.cardSoft, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginTop: 4 },
  amountText: { fontSize: 15, fontWeight: "800" },
  loadingCard: { padding: 32, alignItems: "center", gap: 16, marginBottom: 20 },
  loadingTitle: { color: colors.primaryText, fontSize: 20, fontWeight: "800" },
  loadingBody: { color: colors.secondaryText, fontSize: 14, textAlign: "center", lineHeight: 21 },
});
