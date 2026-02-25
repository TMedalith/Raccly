export interface PaperSource {
  source: string;
  title: string;
  authors: string[];
  year: number | null;
  doi: string | null;
  journal?: string;
  pmc_id?: string;
  score?: number;
  snippet?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: (string | PaperSource)[];
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  sources: (string | PaperSource)[];
  sessionId?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  sessionId: string | null;
  error: string | null;
}

export interface ConversationMeta {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  firstMessage: string;
  messageCount?: number;
}
