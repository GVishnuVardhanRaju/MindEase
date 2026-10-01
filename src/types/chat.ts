export type ChatRole = "assistant" | "user";

export type MoodLabel = "anxious" | "stressed" | "sad" | "overwhelmed" | "positive" | "neutral";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

export type GeminiHistoryTurn = {
  role: "user" | "model";
  text: string;
};
