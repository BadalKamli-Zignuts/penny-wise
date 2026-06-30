"use server";

import { env } from "../../lib/env";

export async function askLumenAction(message: string, tone: string, context: any) {
  if (!env.groq.apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.groq.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.groq.model,
        messages: [
          {
            role: "system",
            content: `You are Penny Wise, a concise and friendly AI financial coach. Answer questions directly using the exact data provided. Be brief and helpful.

CRITICAL RULES:
1. Answer questions directly - don't explain your reasoning or data structure
2. Use ONLY the exact numbers from the context - never estimate
3. If data is not available, simply say "I don't have expense data for that period"
4. Keep responses under 3 sentences unless asked for details
5. Be conversational and supportive, not technical
6. Never mention "context", "data structure", or technical details

Data available:
- currentMonthName: the current month (e.g., "May 2026")
- currentMonthTotal: total spending for current month
- currentMonthCategories: category breakdown for current month
- previousMonthName: the previous month (e.g., "April 2026")
- previousMonthTotal: total spending for previous month
- previousMonthCategories: category breakdown for previous month

When asked about a specific month:
- If it matches currentMonthName, use currentMonthTotal
- If it matches previousMonthName, use previousMonthTotal
- If it's neither, say you don't have data for that month`,
          },
          {
            role: "user",
            content: JSON.stringify({ message, tone, context }),
          },
        ],
        temperature: 0.2,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Groq request failed.");
  }

  const data = await response.json();
  return {
    message: data.choices?.[0]?.message?.content ?? "I could not generate a response.",
    widgets: [],
  };
}
