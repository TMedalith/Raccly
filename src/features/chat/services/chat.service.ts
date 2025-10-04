import { apiService } from '@/shared/services/api.service';
import type { ChatResponse } from '../types';

export const chatService = {
  /**
   * Envía un mensaje y recibe una respuesta del asistente
   * @param message - El mensaje del usuario
   * @param sessionId - ID de la sesión actual
   * @returns Promise con la respuesta
   */
  async sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
    try {
      // Call the real API
      const apiResponse = await apiService.sendChatMessage(message, sessionId);

      return {
        message: apiResponse.response,
        papers: [], // No papers from endpoint yet
        sessionId: apiResponse.sessionId,
        agentAliasId: apiResponse.agent_alias_id,
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

  /**
   * Obtiene el historial de conversación
   * @param conversationId - ID de la conversación
   * @returns Promise con el historial de mensajes
   */
  async getConversationHistory(_conversationId: string) {
    // TODO: Implement conversation history retrieval from backend
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [];
  },

  /**
   * Genera un título para la conversación basado en el primer mensaje
   * @param firstMessage - Primer mensaje de la conversación
   * @returns Título sugerido
   */
  generateConversationTitle(firstMessage: string): string {
    const title = firstMessage.trim().slice(0, 50);
    return title.length < firstMessage.trim().length ? `${title}...` : title;
  },
};
