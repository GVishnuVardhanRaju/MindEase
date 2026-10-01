import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { handleGeminiGuideRequest } from "./src/lib/server/gemini-guide";

function localGeminiApi(): Plugin {
  return {
    name: "mindease-local-gemini-api",
    configureServer(server) {
      const environment = loadEnv(server.config.mode, process.cwd(), "");
      server.middlewares.use(async (incoming, outgoing, next) => {
        if (incoming.url?.split("?")[0] !== "/api/guide") return next();

        try {
          const chunks: Buffer[] = [];
          for await (const chunk of incoming) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }
          const headers = new Headers();
          for (const [name, value] of Object.entries(incoming.headers)) {
            if (typeof value === "string") headers.set(name, value);
            else if (Array.isArray(value)) headers.set(name, value.join(", "));
          }
          const method = incoming.method ?? "GET";
          const init: RequestInit = { method, headers };
          if (method !== "GET" && method !== "HEAD") {
            init.body = new TextDecoder().decode(Buffer.concat(chunks));
          }
          const protocol = headers.get("x-forwarded-proto")?.split(",")[0] ?? "http";
          const host = headers.get("host") ?? "localhost";
          const request = new Request(new URL("/api/guide", `${protocol}://${host}`), init);
          const result = await handleGeminiGuideRequest(request, environment);
          outgoing.statusCode = result.status;
          result.headers.forEach((value, name) => outgoing.setHeader(name, value));
          outgoing.end(await result.text());
        } catch (error) {
          console.error("Local Gemini API request failed", error);
          outgoing.statusCode = 500;
          outgoing.setHeader("Content-Type", "application/json");
          outgoing.end(JSON.stringify({ error: "The AI guide is temporarily unavailable." }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: "react",
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    localGeminiApi(),
  ],
  resolve: { tsconfigPaths: true },
  build: { outDir: "dist" },
  server: { host: "0.0.0.0", port: 8081 },
});
