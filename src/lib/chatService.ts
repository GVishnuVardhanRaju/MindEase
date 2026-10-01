import type { ChatMessage, GeminiHistoryTurn, MoodLabel } from "@/types/chat";

export const CHAT_STORAGE_KEY = "mindease-ai-companion-history-v1";
const MAX_STORED_MESSAGES = 40;
const MAX_REQUEST_HISTORY = 12;

export function createChatMessage(role: ChatMessage["role"], text: string): ChatMessage {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { id, role, text };
}

export function analyzeMood(message: string): MoodLabel {
  const text = message.toLowerCase();
  if (/overwhelm|too much|can't cope|cannot cope|drowning/.test(text)) return "overwhelmed";
  if (/anxious|anxiety|worried|worry|nervous|panic|fear/.test(text)) return "anxious";
  if (/stress|stressed|pressure|tense|burned out|burnt out/.test(text)) return "stressed";
  if (/sad|down|lonely|hopeless|empty|grief/.test(text)) return "sad";
  if (/happy|hopeful|grateful|excited|proud|good day/.test(text)) return "positive";
  return "neutral";
}

export function readChatHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {
    // Ignore storage errors; this experience is intentionally session-only.
  }
  return [];
}

export function saveChatHistory(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch {
    // Ignore storage errors; this experience is intentionally session-only.
  }
}

export async function requestGeminiReply(
  message: string,
  history: ChatMessage[],
): Promise<string> {
  const conversation: GeminiHistoryTurn[] = history
    .slice(-MAX_REQUEST_HISTORY)
    .map(({ role, text }) => ({ role: role === "assistant" ? "model" : "user", text }));

  const response = await fetch("/api/guide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      mood: analyzeMood(message),
      history: conversation,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    reply?: unknown;
    error?: unknown;
  };
  if (!response.ok) {
    throw new Error(
      typeof payload.error === "string"
        ? payload.error
        : "The AI guide couldn’t reply. Please try again.",
    );
  }
  if (typeof payload.reply !== "string" || !payload.reply.trim()) {
    throw new Error("The AI guide returned an empty response. Please try again.");
  }

  return payload.reply.trim();
}
