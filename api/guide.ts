import type { IncomingMessage, ServerResponse } from "node:http";
import { handleGeminiGuideRequest } from "../src/lib/server/gemini-guide";

type ApiRequest = IncomingMessage & { body?: unknown };

export default async function handler(request: ApiRequest, response: ServerResponse) {
  try {
    const headers = new Headers();
    for (const [name, value] of Object.entries(request.headers)) {
      if (typeof value === "string") headers.set(name, value);
      else if (Array.isArray(value)) headers.set(name, value.join(", "));
    }

    let body = "";
    if (typeof request.body === "string") body = request.body;
    else if (request.body !== undefined) body = JSON.stringify(request.body);
    else if (request.method !== "GET" && request.method !== "HEAD") {
      const chunks: Buffer[] = [];
      for await (const chunk of request) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      body = Buffer.concat(chunks).toString("utf8");
    }

    const protocol = headers.get("x-forwarded-proto")?.split(",")[0] ?? "https";
    const host = headers.get("host") ?? "localhost";
    const method = request.method ?? "GET";
    const init: RequestInit = { method, headers };
    if (method !== "GET" && method !== "HEAD") init.body = body;
    const apiRequest = new Request(
      new URL(request.url ?? "/api/guide", `${protocol}://${host}`),
      init,
    );
    const result = await handleGeminiGuideRequest(apiRequest, process.env);
    response.statusCode = result.status;
    result.headers.forEach((value, name) => response.setHeader(name, value));
    response.end(await result.text());
  } catch (error) {
    console.error("Vercel Gemini API request failed", error);
    response.statusCode = 500;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ error: "The AI guide is temporarily unavailable." }));
  }
}
