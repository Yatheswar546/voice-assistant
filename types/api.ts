export interface ChatRequest {
  message: string;
  sessionId?: string;
  documentId?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId?: string;
  sources?: Array<{
    documentId: string;
    documentName: string;
    chunkIndex: number;
    score?: number;
  }>;
}

export interface ApiError {
  error: string;
}