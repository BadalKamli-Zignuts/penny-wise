import { create } from "zustand";

import type { BudgetWithSpending } from "../budgets/types";
import type { Expense } from "../expenses/types";
import { buildCoachContext } from "./context";
import type { ChatMessage } from "./types";

type CoachState = {
  messages: ChatMessage[];
  pending: boolean;
  error: string | null;
  sendMessage: (input: { 
    content: string; 
    expenses: Expense[]; 
    budgets?: BudgetWithSpending[]; 
    currency: string; 
    tone: string;
  }) => Promise<void>;
};

const openingMessage: ChatMessage = {
  id: "opening",
  role: "assistant",
  content: "I'm watching your spending patterns. Ask me where money is leaking or how to stay under budget.",
  createdAt: new Date().toISOString(),
};

export const useCoachStore = create<CoachState>((set) => ({
  messages: [openingMessage],
  pending: false,
  error: null,
  sendMessage: async ({ content, expenses, budgets = [], currency, tone }) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({ messages: [...state.messages, userMessage], pending: true, error: null }));

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          tone,
          context: buildCoachContext({ expenses, budgets, currency, selectedDate: new Date() }),
        }),
      });

      if (!response.ok) throw new Error("AI request failed");
      const data = (await response.json()) as { message?: string };
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message ?? "I could not generate a response.",
        createdAt: new Date().toISOString(),
      };

      set((state) => ({ messages: [...state.messages, assistantMessage], pending: false }));
    } catch {
      const assistantMessage: ChatMessage = {
        id: `assistant-fallback-${Date.now()}`,
        role: "assistant",
        content: "I could not reach Groq yet. Once your API key is configured, I'll analyze your live spending context here.",
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        pending: false,
        error: "Groq is not configured yet.",
      }));
    }
  },
}));
