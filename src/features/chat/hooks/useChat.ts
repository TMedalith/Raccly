import { useState, useCallback, useMemo, useEffect } from 'react';
import { chatService } from '../services/chat.service';
import { generateSessionId } from '@/shared/utils/session';
import { loadMessages, saveMessages } from '@/shared/utils/storage';
import type { Message } from '../types';

interface UseChatOptions {
  conversationId?: string;
}

export function useChat(options?: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const id = options?.conversationId || generateSessionId();
    setSessionId(id);

    const persistedMessages = loadMessages(id);
    if (persistedMessages.length > 0) {
      setMessages(persistedMessages);
    }
  }, [options?.conversationId]);

  useEffect(() => {
    if (sessionId && messages.length > 0) {
      saveMessages(sessionId, messages);
    }
  }, [messages, sessionId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || !sessionId) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      sessionId,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await chatService.sendMessage(content.trim(), sessionId);

      if (response.sessionId && response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        sources: response.sources,
        sessionId: response.sessionId,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error sending message';
      setError(errorMessage);

      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error procesando tu solicitud. Por favor intenta nuevamente.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    if (sessionId) {
      saveMessages(sessionId, []);
    }
  }, [sessionId]);

  const loadConversation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const history = await chatService.getConversationHistory();
      setMessages(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading conversation');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sessionId,
    sendMessage,
    clearMessages,
    loadConversation,
  };
}