export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId?: string;
}

export interface ApiError {
  error: string;
}