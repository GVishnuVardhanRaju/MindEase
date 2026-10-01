import { analyzeMood } from "../chatService";
import { generateWellnessReply } from "../gemini";
import type { GeminiHistoryTurn } from "../../types/chat";

type GeminiEnvironment = Record<string, unknown>;

type GuideInput = {
  message?: unknown;
  history?: unknown;
};

const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_TURNS = 8;
const MAX_HISTORY_TEXT_LENGTH = 1200;
const MAX_GEMINI_ATTEMPTS = 3;
function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
}

function getHistory(value: unknown): GeminiHistoryTurn[] {
  if (!Array.isArray(value)) return [];

  return value.slice(-MAX_HISTORY_TURNS).flatMap((entry) => {
    const turn = asRecord(entry);
    const role = turn?.["role"];
    const text = typeof turn?.["text"] === "string" ? turn["text"].trim() : "";
    if ((role !== "user" && role !== "model") || !text) return [];
    return [{ role, text: text.slice(0, MAX_HISTORY_TEXT_LENGTH) }];
  });
}

function environmentValue(
  workerEnvironment: GeminiEnvironment,
  nodeEnvironment: NodeJS.ProcessEnv,
  ...keys: (keyof GeminiEnvironment)[]
): string | undefined {
  for (const key of keys) {
    const value = workerEnvironment[key] ?? nodeEnvironment[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isTransientGeminiFailure(error: unknown): boolean {
  const status = asRecord(error)?.["status"];
  const message = typeof error === "object" && error !== null ? String((error as { message?: unknown }).message ?? "") : "";
  return status === 429 || status === 503 || /UNAVAILABLE|high demand|temporarily|busy|rate limit|quota/i.test(message);
}

export async function handleGeminiGuideRequest(
  request: Request,
  runtimeEnvironment: unknown,
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return jsonResponse({ error: "Cross-origin requests are not allowed." }, 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_000) {
    return jsonResponse({ error: "That message is too long. Please shorten it and try again." }, 413);
  }

  let input: GuideInput;
  try {
    input = (await request.json()) as GuideInput;
  } catch {
    return jsonResponse({ error: "The guide request was not valid JSON." }, 400);
  }

  if (typeof input.message !== "string" || !input.message.trim()) {
    return jsonResponse({ error: "Enter a message before sending." }, 400);
  }
  if (input.message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse({ error: "Please keep messages under 1,200 characters." }, 413);
  }

  const workerEnvironment = asRecord(runtimeEnvironment) as GeminiEnvironment | undefined;
  const nodeEnvironment = typeof process === "undefined" ? {} : process.env;
  const environment = workerEnvironment ?? {};
  const apiKey = environmentValue(environment, nodeEnvironment, "GEMINI_API_KEY", "GOOGLE_API_KEY");
  if (!apiKey) {
    return jsonResponse(
      { error: "The AI guide is not configured. Add GEMINI_API_KEY to the server environment." },
      503,
    );
  }

  const model = environmentValue(environment, nodeEnvironment, "GEMINI_MODEL") ?? "gemini-3.8-flash";
  const history = getHistory(input.history);

  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_GEMINI_ATTEMPTS; attempt += 1) {
    try {
      const reply = await generateWellnessReply({
        apiKey,
        model,
        message: input.message.trim(),
        history,
        mood: analyzeMood(input.message),
      });

      if (!reply) {
        return jsonResponse({ error: "Gemini returned no text. Please rephrase and try again." }, 502);
      }

      return jsonResponse({ reply });
    } catch (error) {
      lastError = error;
      if (asRecord(error)?.["status"] === 429) break;
      if (!isTransientGeminiFailure(error) || attempt + 1 >= MAX_GEMINI_ATTEMPTS) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  const status = asRecord(lastError)?.["status"];
  if (status === 429) {
    return jsonResponse(
      {
        error:
          "Gemini's API quota has been reached. Please wait and try again; if this continues, check the key's quota and billing in Google AI Studio.",
      },
      429,
    );
  }
  if (status === 503) {
    return jsonResponse(
      { error: "Gemini is temporarily unavailable. Please try your message again shortly." },
      503,
    );
  }
  if (status === 401 || status === 403) {
    return jsonResponse({ error: "Gemini rejected the server API key. Check the key and API access." }, 503);
  }
  console.error("Gemini guide connection failed", lastError instanceof Error ? lastError.message : "Unknown error");
  return jsonResponse({ error: "The AI guide is temporarily unavailable. Please try again." }, 502);
}
