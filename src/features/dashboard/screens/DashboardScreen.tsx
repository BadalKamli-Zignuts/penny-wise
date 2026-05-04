import { subWeeks } from "date-fns";

import { SpendingLineChart } from "@/components/charts/SpendingLineChart";
import { InsightsSection } from "@/components/ui/InsightsSection";
import { LoadingCard } from "@/components/ui/LoadingCard";
import { MetricHero } from "@/components/ui/MetricHero";
import { Screen } from "@/components/ui/Screen";
import {
  buildWeeklySeries,
  calculateWeeklyTotal,
} from "@/features/analytics/selectors";
import { useExpenseStore } from "@/features/expenses/hooks";
import { useSettingsStore } from "@/features/settings/store";
import { View } from "react-native";
import NameHeader from "../../../components/ui/NameHeader";
import { Actions } from "../components/Actions";
import { BudgetIncomeSection } from "../components/BudgetIncomeSection";
import CategoriesOverview from "../components/CategoriesOverview";
import { NoData } from "../components/NoData";
import { RecentExpensesSection } from "../components/RecentExpensesSection";

export default function DashboardScreen() {
  const expenses = useExpenseStore((state) => state.expenses);
  const loading = useExpenseStore((state) => state.loading);
  const currency = useSettingsStore((state) => state.currency);

  const currentDate = new Date();
  const total = calculateWeeklyTotal(expenses, currentDate);

  const prevWeekEnd = subWeeks(currentDate, 1);
  const previousTotal = calculateWeeklyTotal(expenses, prevWeekEnd);

  const weeklySeries = buildWeeklySeries(expenses, currentDate);
  const series = weeklySeries.map((point) => point.value);
  const labels = weeklySeries.map((point) => point.label);
  const dates = weeklySeries.map((point) => point.date);

  return (
    <Screen>
      <NameHeader />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <LoadingCard
            title="Loading your expenses..."
            body="Syncing your financial data from the cloud"
          />
        </View>
      ) : expenses.length === 0 ? (
        <NoData />
      ) : (
        <>
          <MetricHero
            total={total}
            currency={currency}
            previousTotal={previousTotal}
            period="week"
          />
          <SpendingLineChart values={series} labels={labels} dates={dates} />
          <CategoriesOverview />
          <Actions />
          <BudgetIncomeSection />
          <InsightsSection />
          <RecentExpensesSection />
        </>
      )}
    </Screen>
  );
}
