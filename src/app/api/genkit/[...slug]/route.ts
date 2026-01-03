// src/app/api/genkit/[...slug]/route.ts
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";
import { NextRequest } from "next/server";
import {`POST`
  createApp,
  toExpress,
} from "@genkit-ai/next";

// This is our main Genkit configuration.
genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-2.5-flash",
});

// We are creating an Express app from our Genkit configuration.
// This is so we can use it in a Next.js route handler.
const app = createApp();

// Next.js route handlers for POST, GET, OPTIONS.
export async function POST(req: NextRequest) {
  return toExpress(req, app);
}

export async function GET(req: NextRequest) {
  return toExpress(req, app);
}

export async function OPTIONS(req: NextRequest) {
  return toExpress(req, app);
}
