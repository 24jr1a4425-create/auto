import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { NextRequest } from "next/server";

// Force Node runtime for Vercel
export const runtime = "nodejs";

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-2.5-flash",
});

// Create a reusable HTTP handler
const handler = ai.http();

// Next.js App Router handlers
export async function POST(req: NextRequest) {
  return handler(req);
}

export const GET = POST;
export const OPTIONS = POST;
