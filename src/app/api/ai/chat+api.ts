import { env } from "../../../lib/env";

export async function POST(request: Request) {
  if (!env.groq.apiKey) {
    return Response.json(
      { error: "GROQ_API_KEY is not configured." },
      { status: 503 },
    );
  }

  const body = await request.json();
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
- If it's neither, say you don't have data for that month

Example responses:
Q: "What was my expense in April?"
A: "Your total expense in April 2026 was ₹8,540. The top categories were housing (₹1,500), food (₹260), and transport (₹60)."

Q: "Do we have expenses in February?"
A: "I don't have expense data for February."`,
          },
          {
            role: "user",
            content: JSON.stringify(body),
          },
        ],
        temperature: 0.2,
      }),
    },
  );

  if (!response.ok) {
    return Response.json(
      { error: "Groq request failed." },
      { status: response.status },
    );
  }

  const data = await response.json();
  return Response.json({
    message:
      data.choices?.[0]?.message?.content ?? "I could not generate a response.",
    widgets: [],
  });
}
