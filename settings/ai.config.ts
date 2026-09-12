export const AI_CONFIG = {
  PROVIDER: (process.env.AI_PROVIDER || "ollama").toLowerCase() as "gemini" | "ollama",
  MODEL:
    (process.env.AI_PROVIDER || "ollama").toLowerCase() === "gemini"
      ? process.env.GEMINI_MODEL || "models/gemini-3.8-flash"
      : process.env.OLLAMA_MODEL || "gemma4:31b",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "models/gemini-3.8-flash",
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || "gemma4:31b",
  TEMPERATURE: Number(process.env.OLLAMA_TEMPERATURE ?? 0.7),
  MAX_OUTPUT_TOKENS: Number(process.env.OLLAMA_MAX_OUTPUT_TOKENS ?? 2048),
};
