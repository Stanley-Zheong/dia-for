import { GoogleGenAI } from "@google/genai";

import { siteConfig } from "@/lib/config";

type GeminiJsonOptions = {
  prompt: string;
  fallback: unknown;
};

function getClient() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return null;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new GoogleGenAI({ apiKey });
}

function extractJson(text: string) {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? text;
  return JSON.parse(raw.trim());
}

export async function generateGeminiJson<T>({ prompt, fallback }: GeminiJsonOptions) {
  const client = getClient();

  if (!client) {
    return fallback as T;
  }

  try {
    const response = await client.models.generateContent({
      model: siteConfig.geminiModel,
      contents: prompt,
    });
    const text = response.text ?? "";
    return extractJson(text) as T;
  } catch (error) {
    console.error("Gemini generation failed", error);
    return fallback as T;
  }
}
