import { router } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { GradientButton } from "@/components/ui/GradientButton";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/theme/colors";

export default function NoData() {
    return (
      <Screen scroll={false} style={styles.empty}>
        <View style={styles.emptyContent}>
          <View style={styles.emptyIcon}>
            <ChevronDown size={48} color={colors.secondaryText} />
          </View>
          <Text style={styles.emptyTitle}>No data to analyze</Text>
          <Text style={styles.emptyBody}>
            Add some expenses to see detailed analytics and spending trends.
          </Text>
          <GradientButton
            label="Add First Expense"
            onPress={() => router.push("/expense/new")}
          />
        </View>
      </Screen>
    );
}

const styles = StyleSheet.create({
  empty: { justifyContent: "center" },
  emptyContent: { alignItems: "center", paddingHorizontal: 40, gap: 16 },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    color: colors.primaryText,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  emptyBody: {
    color: colors.secondaryText,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
});
