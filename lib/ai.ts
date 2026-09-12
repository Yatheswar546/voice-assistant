import { generateGeminiChatCompletion, listGeminiModels } from "@/lib/gemini";
import { generateOllamaChatCompletion, listOllamaModels } from "@/lib/ollama";
import { AI_CONFIG } from "@/settings/ai.config";

export type AIProvider = "gemini" | "ollama";

export interface AIChatRequest {
    model: string;
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    temperature?: number;
    maxOutputTokens?: number;
}

export async function generateChatCompletion(request: AIChatRequest) {
    if (AI_CONFIG.PROVIDER === "gemini") {
        return generateGeminiChatCompletion(request);
    }

    if (AI_CONFIG.PROVIDER === "ollama") {
        return generateOllamaChatCompletion(request);
    }

    throw new Error(`Unsupported AI provider: ${AI_CONFIG.PROVIDER}`);
}

export async function listAvailableModels() {
    if (AI_CONFIG.PROVIDER === "gemini") {
        return listGeminiModels();
    }

    if (AI_CONFIG.PROVIDER === "ollama") {
        return listOllamaModels();
    }

    throw new Error(`Unsupported AI provider: ${AI_CONFIG.PROVIDER}`);
}
