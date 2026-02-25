import type { ChatResponse, Message, PaperSource } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';
const API_URL = `${BASE_URL}/query-stream`;

export const chatService = {
  async sendMessage(
    message: string,
    sessionId: string,
    history: Message[],
    onToken: (token: string) => void,
    onSources?: (sources: (string | PaperSource)[]) => void
  ): Promise<ChatResponse> {
    try {
      const chatHistory = history
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: message,
          session_id: sessionId,
          top_k: 10,
          use_rerank: true,
          use_hyde: false,
          chat_history: chatHistory,
        }),
      });

      if (!response.ok) throw new Error('Error al procesar la consulta');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let sources: (string | PaperSource)[] = [];

      if (reader) {
        let lineBuffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          lineBuffer += decoder.decode(value, { stream: true });
          const lines = lineBuffer.split('\n');
          lineBuffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'token') {
                fullText += parsed.content;
                onToken(parsed.content);
              } else if (parsed.type === 'sources') {
                sources = parsed.content as (string | PaperSource)[];
                onSources?.(sources);
              }
            } catch { /* malformed chunk */ }
          }
        }

        if (lineBuffer.startsWith('data: ')) {
          const data = lineBuffer.slice(6).trim();
          if (data !== '[DONE]') {
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'sources') {
                sources = parsed.content as (string | PaperSource)[];
                onSources?.(sources);
              }
            } catch { /* ignore */ }
          }
        }
      }

      return { message: fullText, sources, sessionId };
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Error processing your message.'
      );
    }
  },
};
