import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { genkitNextHandler } from "@genkit-ai/next";

export const runtime = "nodejs";

// Initialize Genkit
genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-2.5-flash",
});

// Next.js handlers
export const POST = genkitNextHandler();
export const GET = POST;
export const OPTIONS = POST;
