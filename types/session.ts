export interface ChatSession {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionGroup {
  title: string;
  sessions: ChatSession[];
}