import { addMonths, addWeeks, addYears, format, subMonths, subWeeks, subYears } from "date-fns";
import { useState } from "react";
import { Text, View } from "react-native";

import { CategoryDonutChart } from "@/components/charts/CategoryDonutChart";
import { SpendingLineChart } from "@/components/charts/SpendingLineChart";
import { GlassCard } from "@/components/ui/GlassCard";
import { MonthNavigator } from "@/components/ui/MonthNavigator";
import { PeriodSelector } from "@/components/ui/PeriodSelector";
import { Screen } from "@/components/ui/Screen";
import { getCategory } from "@/constants/categories";
import NoData from "@/features/analytics/components/NoData";
import { useBudgetsWithSpending } from "@/features/budgets/hooks/useBudgetsWithSpending";
import { useExpenseStore } from "@/features/expenses/hooks";
import { useSettingsStore } from "@/features/settings/store";
import { colors } from "@/theme/colors";
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import { styles } from "../styles";
import { Period } from "../types";

export default function AnalyticsScreen() {
  const budgets = useBudgetsWithSpending();
  const expenses = useExpenseStore((state) => state.expenses);
  const currency = useSettingsStore((state) => state.currency);

  const [period, setPeriod] = useState<Period>("month");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    total,
    categories,
    comparison,
    prevTotal,
    prevStart,
    totalBudget,
    budgetDiff,
    projected,
    series,
    labels,
    dates,
    donutData,
  } = useAnalyticsData({
    expenses,
    budgets,
    selectedDate,
    period,
  });

  const navigatePeriod = (direction: "prev" | "next") => {
    if (period === "month") {
      setSelectedDate(
        direction === "prev"
          ? subMonths(selectedDate, 1)
          : addMonths(selectedDate, 1),
      );
    } else if (period === "week") {
      setSelectedDate(
        direction === "prev"
          ? subWeeks(selectedDate, 1)
          : addWeeks(selectedDate, 1),
      );
    } else if (period === "year") {
      setSelectedDate(
        direction === "prev"
          ? subYears(selectedDate, 1)
          : addYears(selectedDate, 1),
      );
    }
  };

  if (expenses.length === 0) return <NoData />;

  const handlePrev = () => {
    navigatePeriod("prev");
  };

  const handleNext = () => {
    navigatePeriod("next");
  };

  // Format the comparison period label
  const getComparisonLabel = () => {
    if (period === "week") {
      return format(prevStart, "MMM d");
    } else if (period === "year") {
      return format(prevStart, "yyyy");
    }
    return format(prevStart, "MMM");
  };

  // Format the current period label for navigator
  const getPeriodLabel = () => {
    if (period === "week") {
      return format(selectedDate, "'Week of' MMM d, yyyy");
    } else if (period === "year") {
      return format(selectedDate, "yyyy");
    }
    return format(selectedDate, "MMMM yyyy");
  };

  return (
    <Screen>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Analytics</Text>
      </View>
      <View style={styles.center}>
        <PeriodSelector value={period} onChange={setPeriod} />

        {(period === "month" || period === "week" || period === "year") && (
          <MonthNavigator
            date={selectedDate}
            onNext={handleNext}
            onPrev={handlePrev}
            label={getPeriodLabel()}
          />
        )}

        <Text style={styles.total}>
          {currency}
          {total.toLocaleString("en-IN")}
        </Text>
        {prevTotal > 0 && (
          <View style={styles.badgeWrap}>
            <Text
              style={[
                styles.badge,
                { color: comparison < 0 ? colors.mint : colors.coral },
              ]}
            >
              {comparison < 0 ? "↓" : "↑"} {Math.abs(comparison).toFixed(1)}% vs{" "}
              {getComparisonLabel()}
            </Text>
          </View>
        )}
      </View>

      <SpendingLineChart values={series} labels={labels} dates={dates} />

      {period === "month" && (
        <GlassCard style={styles.prediction}>
          <View>
            <Text style={styles.muted}>Projected End of Month</Text>
            <Text style={styles.predicted}>
              {currency}
              {projected.toLocaleString("en-IN")}
            </Text>
          </View>
          {totalBudget > 0 && (
            <View style={styles.right}>
              <Text style={styles.muted}>
                Budget: {currency}
                {totalBudget.toLocaleString("en-IN")}
              </Text>
              <Text
                style={[
                  styles.warning,
                  budgetDiff < 0 && { color: colors.mint },
                ]}
              >
                {budgetDiff > 0 ? "+" : ""}
                {currency}
                {Math.abs(budgetDiff).toLocaleString("en-IN")}{" "}
                {budgetDiff > 0 ? "over" : "under"}
              </Text>
            </View>
          )}
        </GlassCard>
      )}

      <Text style={styles.sectionTitle}>Categories</Text>
      {categories.length > 0 ? (
        <>
          <GlassCard style={styles.breakdown}>
            <CategoryDonutChart data={donutData} />
          </GlassCard>

          {/* Category Spending Details */}
          <GlassCard style={styles.categoryDetails}>
            <Text style={styles.categoryDetailsTitle}>Spending by Category</Text>
            {categories.map((cat) => {
              const category = getCategory(cat.categoryId);
              const Icon = category.icon;
              return (
                <View key={cat.categoryId} style={styles.categoryRow}>
                  <View style={styles.categoryLeft}>
                    <View
                      style={[
                        styles.categoryIconSmall,
                        {
                          backgroundColor: `${category.color}1F`,
                          borderColor: `${category.color}55`,
                        },
                      ]}
                    >
                      <Icon size={14} color={category.color} />
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={styles.categoryAmount}>
                      {currency}
                      {cat.total.toLocaleString("en-IN")}
                    </Text>
                    <Text style={styles.categoryPercent}>{cat.percentage}%</Text>
                  </View>
                </View>
              );
            })}
          </GlassCard>
        </>
      ) : (
        <GlassCard style={styles.breakdown}>
          <Text style={styles.noData}>No expenses in this period</Text>
        </GlassCard>
      )}
      <View style={{ height: 100 }} />
    </Screen>
  );
}
