import { useEffect } from "react";

import { useBudgetsWithSpending } from "../budgets/hooks/useBudgetsWithSpending";
import { useExpenseStore } from "../expenses/hooks";
import { useSettingsStore } from "../settings/store";
import { generateInsights } from "./generator";
import { useInsightsStore } from "./store";

/**
 * Hook to get AI-generated insights based on current expenses and budgets
 * Insights are shared across the app via store
 */
export function useInsights() {
  return useInsightsStore((state) => state.insights);
}

/**
 * Hook to check if insights are currently loading
 */
export function useInsightsLoading() {
  return useInsightsStore((state) => state.loading);
}

/**
 * Hook to trigger insights generation
 * Should be called once in the app (e.g., on dashboard)
 */
export function useGenerateInsights() {
  const expenses = useExpenseStore((state) => state.expenses);
  const budgets = useBudgetsWithSpending();
  const currency = useSettingsStore((state) => state.currency);
  const setInsights = useInsightsStore((state) => state.setInsights);
  const setLoading = useInsightsStore((state) => state.setLoading);
  const lastGenerated = useInsightsStore((state) => state.lastGenerated);

  useEffect(() => {
    let cancelled = false;

    async function fetchInsights() {
      if (expenses.length === 0) {
        setInsights([]);
        return;
      }

      // Don't regenerate if we already have recent insights (within 5 minutes)
      if (lastGenerated && Date.now() - lastGenerated < 5 * 60 * 1000) {
        return;
      }

      setLoading(true);
      try {
        const result = await generateInsights(expenses, budgets, currency);
        if (!cancelled) {
          setInsights(result);
        }
      } catch (error) {
        console.error("Failed to generate insights:", error);
        if (!cancelled) {
          setInsights([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchInsights();

    return () => {
      cancelled = true;
    };
  }, [
    expenses.length,
    budgets.length,
    currency,
    setInsights,
    setLoading,
    lastGenerated,
  ]);
}
