export const OLLAMA_BASE_URL =
    process.env.OLLAMA_BASE_URL || "https://ollama.com";

const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;

export type AIMessageRole = "user" | "assistant" | "system";

export interface AIMessage {
    role: AIMessageRole;
    content: string;
}

interface OllamaChatRequest {
    model: string;
    messages: AIMessage[];
    stream?: boolean;
    options?: {
        temperature?: number;
        num_predict?: number;
    };
}

interface OllamaChatResponse {
    message?: {
        role?: string;
        content?: string;
    };
    error?: string;
}

interface OllamaModelListResponse {
    models?: Array<{ name?: string; size?: number; modified_at?: string }>;
}

async function fetchOllama<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${OLLAMA_BASE_URL.replace(/\/$/, "")}${path}`;
    const headers = new Headers(init?.headers || {});

    headers.set("Content-Type", "application/json");

    if (OLLAMA_API_KEY) {
        headers.set("Authorization", `Bearer ${OLLAMA_API_KEY}`);
    }

    const response = await fetch(url, {
        ...init,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Ollama API error (${response.status}): ${errorText || response.statusText}`
        );
    }

    return (await response.json()) as T;
}

export async function generateOllamaChatCompletion({
    model,
    messages,
    temperature,
    maxOutputTokens,
}: {
    model: string;
    messages: AIMessage[];
    temperature?: number;
    maxOutputTokens?: number;
}) {
    const request: OllamaChatRequest = {
        model,
        messages,
        stream: false,
        options: {
            ...(temperature !== undefined ? { temperature } : {}),
            ...(maxOutputTokens !== undefined ? { num_predict: maxOutputTokens } : {}),
        },
    };

    const response = await fetchOllama<OllamaChatResponse>("/api/chat", {
        method: "POST",
        body: JSON.stringify(request),
    });

    if (response.error) {
        throw new Error(response.error);
    }

    return response.message?.content || "Sorry, I couldn't generate a response.";
}

export async function listOllamaModels() {
    const data = await fetchOllama<OllamaModelListResponse>("/api/tags");
    return data.models ?? [];
}
