import { GoogleGenAI } from "@google/genai";

export const geminiAi = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

function isRetryableGeminiError(error: unknown): boolean {
  const errorMessage =
    error instanceof Error ? error.message : String(error);

  return (
    errorMessage.includes("503") ||
    errorMessage.includes("UNAVAILABLE") ||
    errorMessage.includes("429") ||
    errorMessage.includes("RESOURCE_EXHAUSTED")
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateGeminiChatCompletion({
  model,
  messages,
  temperature,
  maxOutputTokens,
}: {
  model: string;
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  temperature?: number;
  maxOutputTokens?: number;
}) {
  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `Gemini request attempt ${attempt + 1}/${MAX_RETRIES + 1}`
      );

      const response = await geminiAi.models.generateContent({
        model,
        contents,
        config: {
          temperature,
          maxOutputTokens,
        },
      });

      return response.text ?? "Sorry, I couldn't generate a response.";
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini request failed on attempt ${attempt + 1}:`,
        error
      );

      const shouldRetry =
        attempt < MAX_RETRIES && isRetryableGeminiError(error);

      if (!shouldRetry) {
        break;
      }

      console.log(
        `Retrying Gemini request in ${RETRY_DELAY_MS}ms...`
      );

      await sleep(RETRY_DELAY_MS);
    }
  }

  throw new Error(
    "The AI service is temporarily unavailable. Please try again in a moment."
  );
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

export async function generateGeminiEmbedding({
  model,
  text,
}: {
  model: string;
  text: string;
}) {
  const response = await geminiAi.models.embedContent({
    model,
    contents: text,
  });

  return response.embeddings?.[0]?.values ?? [];
}