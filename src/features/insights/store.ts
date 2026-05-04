import { create } from "zustand";
import type { NewInsight } from "./types";

type InsightsState = {
  insights: NewInsight[];
  loading: boolean;
  lastGenerated: number | null;
  setInsights: (insights: NewInsight[]) => void;
  setLoading: (loading: boolean) => void;
  clearInsights: () => void;
};

export const useInsightsStore = create<InsightsState>((set) => ({
  insights: [],
  loading: false,
  lastGenerated: null,
  setInsights: (insights) => set({ insights, lastGenerated: Date.now() }),
  setLoading: (loading) => set({ loading }),
  clearInsights: () => set({ insights: [], lastGenerated: null }),
}));
