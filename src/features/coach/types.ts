export type CoachTone = "casual" | "strict" | "advisor";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};
