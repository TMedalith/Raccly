import { useState, useCallback, useEffect } from 'react';
import { chatService } from '../services/chat.service';
import { generateSessionId } from '@/shared/utils/session';
import { loadMessages, saveMessages, saveConversationMeta } from '@/shared/utils/storage';
import type { Message } from '../types';

interface UseChatOptions {
  conversationId?: string;
}

export function useChat(options?: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  useEffect(() => {
    const id = options?.conversationId || generateSessionId();
    setSessionId(id);
    const persisted = loadMessages(id);
    if (persisted.length > 0) setMessages(persisted);
  }, [options?.conversationId]);

  useEffect(() => {
    if (!sessionId || messages.length === 0 || streamingMessageId) return;
    saveMessages(sessionId, messages);
    const firstUser = messages.find((m) => m.role === 'user');
    if (firstUser) {
      const title =
        firstUser.content.length > 52
          ? firstUser.content.slice(0, 50) + '…'
          : firstUser.content;
      saveConversationMeta({
        id: sessionId,
        title,
        firstMessage: firstUser.content,
        createdAt: messages[0].timestamp.getTime(),
        updatedAt: Date.now(),
        messageCount: messages.length,
      });
    }
  }, [messages, sessionId, streamingMessageId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || !sessionId) return;
      setIsLoading(true);

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
        sessionId,
      };

      let historySnapshot: Message[] = [];
      setMessages((prev) => {
        historySnapshot = prev;
        return [...prev, userMessage];
      });

      const assistantId = `assistant-${Date.now()}`;
      setStreamingMessageId(assistantId);

      const assistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        sessionId,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const handleToken = (token: string) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: msg.content + token } : msg
            )
          );
        };

        const handleSources = (sources: unknown[]) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, sources: sources as Message['sources'] } : msg
            )
          );
        };

        const response = await chatService.sendMessage(
          content.trim(),
          sessionId,
          historySnapshot,
          handleToken,
          handleSources
        );

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, sources: response.sources as Message['sources'] }
              : msg
          )
        );
      } catch (err) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: 'Lo siento, hubo un error procesando tu solicitud. Por favor intenta nuevamente.' }
              : msg
          )
        );
        console.error('Chat error:', err instanceof Error ? err.message : err);
      } finally {
        setIsLoading(false);
        setStreamingMessageId(null);
      }
    },
    [isLoading, sessionId]
  );

  return { messages, isLoading, sessionId, sendMessage };
}
