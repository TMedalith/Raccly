// chat.service.ts
import type { ChatResponse } from '../types';

const API_URL = 'https://kln7wnk7775hoeag75zor5lp3m0ulatg.lambda-url.us-east-1.on.aws';

export const chatService = {
  async sendMessage(
    message: string, 
    sessionId: string, 
    onToken: (token: string) => void,
    onSources?: (sources: string[]) => void
  ): Promise<ChatResponse> {
    try {
      // Llamar a la URL sin /query, y usar stream: true por defecto (streaming)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,
          top_k: 5,
          stream: true  // Streaming habilitado
        }),
      });

      if (!response.ok) {
        throw new Error('Error al procesar la consulta');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let sources: string[] = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.replace("data: ", "").trim();
              if (data === "[DONE]") continue;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'token') {
                  fullText += parsed.content;
                  onToken(parsed.content);
                } else if (parsed.type === 'sources') {
                  sources = parsed.content;
                  if (onSources) {
                    onSources(sources);
                  }
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }

      return {
        message: fullText,
        sources: sources,
        sessionId,
      };
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Error processing your message. Please try again.'
      );
    }
  },

  // Versión alternativa SIN streaming (si la necesitas)
  async sendMessageNoStream(
    message: string, 
    sessionId: string
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,
          top_k: 5,
          stream: false  // Sin streaming
        }),
      });

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