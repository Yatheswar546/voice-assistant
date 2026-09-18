export interface ChatSession {
  _id: string;
  title: string;
  documentId: string | null;
  documentName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionGroup {
  title: string;
  sessions: ChatSession[];
}