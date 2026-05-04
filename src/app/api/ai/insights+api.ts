import { env } from "../../../lib/env";

export async function POST(request: Request) {
  if (!env.groq.apiKey) {
    return Response.json({ insights: [] });
  }

  const body = await request.json();

  // Check if this is a daily insight request
  if (body.requestType === "daily_insight") {
    return handleDailyInsight(body);
  }

  // Otherwise, handle monthly insights
  return handleMonthlyInsights(body);
}

async function handleDailyInsight(body: any) {
  const systemPrompt = `You are a financial advisor AI analyzing a single day's spending. Generate ONE concise, personalized insight about this day's spending.

Rules:
1. Be specific and use actual numbers from the data
2. Focus on patterns, comparisons, or notable observations
3. Be conversational and supportive
4. Keep it under 100 characters
5. Return ONLY a JSON object with "insight" key, no other text

Response format:
{ "insight": "Your insight here" }`;

  const userPrompt = `Analyze this day's spending:

Date: ${body.dailyData.date}
Total spent: ${body.currency}${body.dailyData.total.toLocaleString("en-IN")}
Transactions: ${body.dailyData.transactionCount}

Categories: ${JSON.stringify(body.dailyData.categories)}

Top expenses: ${JSON.stringify(body.dailyData.topExpenses)}

Generate ONE insightful observation as JSON.`;

  try {
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
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      },
    );

    if (!response.ok) {
      console.error("Groq API error:", response.status, response.statusText);
      return Response.json({ raw: "" });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    return Response.json({ raw: content });
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return Response.json({ raw: "" });
  }
}

async function handleMonthlyInsights(body: any) {
  const systemPrompt = `You are a financial advisor AI analyzing spending patterns. Generate 3-5 personalized, actionable insights based on the user's spending data.

Rules:
1. Be specific and use actual numbers from the data
2. Focus on actionable advice, not generic statements
3. Identify patterns, anomalies, and opportunities
4. Compare current vs previous month when relevant
5. Highlight budget concerns if any
6. Be conversational and supportive, not judgmental
7. Return ONLY a JSON array, no other text

Response format:
[
  {
    "type": "spending_spike|savings|budget|recurring|trend|anomaly|achievement",
    "priority": "low|medium|high",
    "title": "Short, clear title (max 50 chars)",
    "body": "Detailed insight with specific numbers and actionable advice (max 150 chars)"
  }
]`;

  const userPrompt = `Analyze this spending data and generate insights:

Currency: ${body.currency}

Current Month (${body.currentMonthName}):
- Total spent: ${body.currency}${body.currentMonthTotal.toLocaleString("en-IN")}
- Top categories: ${JSON.stringify(body.currentMonthCategories)}

Previous Month (${body.previousMonthName}):
- Total spent: ${body.currency}${body.previousMonthTotal.toLocaleString("en-IN")}
- Top categories: ${JSON.stringify(body.previousMonthCategories)}

Budgets: ${JSON.stringify(body.budgets)}

Recent expenses: ${JSON.stringify(body.recentExpenses.slice(0, 5))}

Recurring expenses: ${body.recurringCount}

Generate 3-5 personalized insights as JSON array.`;

  try {
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
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      },
    );

    if (!response.ok) {
      console.error("Groq API error:", response.status, response.statusText);
      return Response.json({ insights: [] });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "[]";

    return Response.json({ raw: content });
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return Response.json({ insights: [] });
  }
}
