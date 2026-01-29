import type { ChatResponse } from '../types';

const API_URL = 'https://jn3779aza9.execute-api.us-east-1.amazonaws.com';

export const chatService = {
  async sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos timeout

      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,
          top_k: 5
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Error al procesar la consulta');
      }

      const data = await response.json();

      return {
        message: data.answer,
        sources: data.sources || [],
        sessionId,
      };
    } catch (error) {
      console.error('Chat service error:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La consulta tomó demasiado tiempo. Por favor intenta de nuevo.');
      }
      
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Error processing your message. Please try again.'
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