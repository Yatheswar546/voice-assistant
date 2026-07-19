export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
}

export interface ApiError {
  error: string;
}