import { router } from "expo-router";
import { ChevronRight, Sparkles } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useGenerateInsights, useInsights, useInsightsLoading } from "../../features/insights/hooks";
import { colors } from "../../theme/colors";
import { GlassCard } from "./GlassCard";
import { InsightCard } from "./InsightCard";

export function InsightsSection() {
  // This hook triggers insights generation
  useGenerateInsights();
  
  // Get insights from store
  const insights = useInsights();
  const loading = useInsightsLoading();

  // Don't show section if no insights and not loading
  if (insights.length === 0 && !loading) {
    return null;
  }

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>AI Insights</Text>
        {!loading && insights.length > 0 && (
          <Pressable style={styles.viewAllBtn} onPress={() => router.push("/insights")}>
            <Text style={styles.viewAllText}>View all</Text>
            <ChevronRight size={15} color={colors.violet} />
          </Pressable>
        )}
      </View>
      
      {loading ? (
        <GlassCard style={styles.loadingCard}>
          <View style={styles.loadingContent}>
            <Sparkles size={24} color={colors.violet} />
            <Text style={styles.loadingText}>AI is analyzing your spending patterns...</Text>
          </View>
        </GlassCard>
      ) : (
        insights.slice(0, 2).map((insight, index) => (
          <InsightCard
            key={index}
            title={insight.title}
            body={insight.body}
            kind={insight.priority === "high" ? "alert" : "spark"}
          />
        ))
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { 
    color: colors.primaryText, 
    fontSize: 18, 
    fontWeight: "900" 
  },
  viewAllBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 2 
  },
  viewAllText: { 
    color: colors.violet, 
    fontSize: 14, 
    fontWeight: "700" 
  },
  loadingCard: { 
    padding: 24, 
    alignItems: "center", 
    justifyContent: "center", 
    minHeight: 100,
    marginBottom: 12,
  },
  loadingContent: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12 
  },
  loadingText: { 
    color: colors.secondaryText, 
    fontSize: 14, 
    fontWeight: "700" 
  },
});
