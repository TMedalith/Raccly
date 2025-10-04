import type { Paper } from '@/features/papers/types';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedPapers?: Paper[]; }

export interface ChatResponse {
  message: string;
  papers: Paper[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}
