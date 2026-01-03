import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { genkitNextHandler } from "@genkit-ai/next";

// Optional but recommended: force Node runtime (Genkit not supported on Edge yet)
export const runtime = "nodejs";

// Initialize Genkit ONCE per server
genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-2.5-flash",
});

// Next.js App Router handlers
export const POST = genkitNextHandler();
export const GET = POST;
export const OPTIONS = POST;
