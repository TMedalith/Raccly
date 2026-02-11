export type ConversationColor = 'lavender' | 'mint' | 'peach' | 'pink' | 'sky';

export interface Conversation {
  id: string;
  title: string;
  color?: ConversationColor;
  lastMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface CreateConversationRequest {
  title: string;
}
