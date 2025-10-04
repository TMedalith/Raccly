import type { Paper } from '@/features/papers/types';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedPapers?: Paper[];
  sessionId?: string;
  agentAliasId?: string;
  references?: string[];
}

export interface ChatResponse {
  message: string;
  papers: Paper[];
  sessionId?: string;
  agentAliasId?: string;
  references?: string[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  sessionId: string | null;
  error: string | null;
}

export interface ApiChatResponse {
  response: string;
  sessionId: string;
  agent_alias_id: string;
  references?: string[];
}
