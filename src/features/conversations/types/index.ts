export type ConversationColor = 'lavender' | 'mint' | 'peach' | 'pink' | 'sky';

export interface Conversation {
  id: string;
  title: string;
  color: ConversationColor;
  lastMessage: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface CreateConversationRequest {
  title: string;
}
