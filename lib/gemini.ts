import { GoogleGenAI } from "@google/genai";

export const geminiAi = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateGeminiChatCompletion({
  model,
  messages,
  temperature,
  maxOutputTokens,
}: {
  model: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  temperature?: number;
  maxOutputTokens?: number;
}) {
  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  const response = await geminiAi.models.generateContent({
    model,
    contents,
    config: {
      temperature,
      maxOutputTokens,
    },
  });

  return response.text ?? "Sorry, I couldn't generate a response.";
}

export async function listGeminiModels() {
  const response = await geminiAi.models.list();
  return ((response as any)?.models ?? response ?? []) as any[];
}

export const ai = geminiAi;