import { GoogleGenAI } from "@google/genai";
import { AI_SYSTEM_PROMPT } from "./aiPrompt";
import type { GeminiHistoryTurn, MoodLabel } from "../types/chat";

type GenerateWellnessReplyOptions = {
  apiKey: string;
  model: string;
  message: string;
  history: GeminiHistoryTurn[];
  mood: MoodLabel;
};

export async function generateWellnessReply({
  apiKey,
  model,
  message,
  history,
  mood,
}: GenerateWellnessReplyOptions): Promise<string> {
  const client = new GoogleGenAI({ apiKey });
  const moodContext = `Possible language cue: ${mood}. This is an uncertain sentiment signal, not a diagnosis; do not assume it is correct.`;
  const currentMessage = `${moodContext}\n\nCurrent user message:\n${message}`;
  const contents = [
    ...history.map(({ role, text }) => ({ role, parts: [{ text }] })),
    { role: "user", parts: [{ text: currentMessage }] },
  ];

  const result = await client.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: AI_SYSTEM_PROMPT,
      temperature: 0.45,
      maxOutputTokens: 500,
    },
  });

  return result.text?.trim() ?? "";
}
