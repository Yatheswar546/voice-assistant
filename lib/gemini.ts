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

export async function generateGeminiImageDescription({
  model,
  image,
  mimeType,
}: {
  model: string;
  image: Buffer;
  mimeType: string;
}) {
  const base64Image = image.toString("base64");

  const response = await geminiAi.models.generateContent({
    model,
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
          {
            text: `
Analyze this image for a document retrieval system.

Extract all meaningful information visible in the image, including:
- Text
- Headings
- Labels
- Tables
- Important visual information
- Charts or diagrams
- Relationships between visual elements

Return a clear, factual textual representation of the image.
Do not invent information that is not visible.
            `.trim(),
          },
        ],
      },
    ],
  });

  return response.text ?? "";
}

export async function listGeminiModels() {
  const response = await geminiAi.models.list();
  return ((response as any)?.models ?? response ?? []) as any[];
}

export const ai = geminiAi;