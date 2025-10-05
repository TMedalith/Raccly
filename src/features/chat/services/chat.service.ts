import { apiService } from '@/shared/services/api.service';
import type { ChatResponse } from '../types';

export const chatService = {
    async sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
    try {
            const apiResponse = await apiService.sendChatMessage(message, sessionId);

      return {
        message: apiResponse.response,
        papers: [],         sessionId: apiResponse.sessionId,
        agentAliasId: apiResponse.agent_alias_id,
        references: apiResponse.references || [],
      };
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Error al procesar tu mensaje. Por favor intenta de nuevo.'
      );
    }
  },

    async getConversationHistory() {
        await new Promise((resolve) => setTimeout(resolve, 500));
    return [];
  },

    generateConversationTitle(firstMessage: string): string {
    const title = firstMessage.trim().slice(0, 50);
    return title.length < firstMessage.trim().length ? `${title}...` : title;
  },
};
