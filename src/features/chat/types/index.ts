export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  sources: string[];
  sessionId?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  sessionId: string | null;
  error: string | null;
}