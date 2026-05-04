export type InsightType = 
  | "spending_spike"
  | "savings_opportunity"
  | "budget_alert"
  | "recurring_review"
  | "category_trend"
  | "anomaly"
  | "achievement";

export type InsightPriority = "low" | "medium" | "high";

export type Insight = {
  id: string;
  userId: string;
  type: InsightType;
  priority: InsightPriority;
  title: string;
  body: string;
  categoryId?: string;
  amount?: number;
  metadata?: Record<string, any>;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewInsight = Omit<Insight, "id" | "userId" | "createdAt" | "updatedAt">;
