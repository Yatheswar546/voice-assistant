export interface ChatMessage {
  role: "user" | "assistant";
  message: string;
  category?: string;
}