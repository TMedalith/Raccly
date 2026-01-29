// useChat.ts
import { useState, useCallback, useEffect } from 'react';
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
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

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
      if (!streamingMessageId) {
        saveMessages(sessionId, messages);
      }
    }
  }, [messages, sessionId, streamingMessageId]);

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

    const assistantMessageId = `assistant-${Date.now()}`;
    setStreamingMessageId(assistantMessageId);

    const assistantMessage: Message = {
      id: assistantMessageId,
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
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + token }
              : msg
          )
        );
      };

      const handleSources = (sources: string[]) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, sources: sources }
              : msg
          )
        );
      };

      const response = await chatService.sendMessage(
        content.trim(),
        sessionId,
        handleToken,
        handleSources
      );

      if (response.sessionId && response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
      }

      // Final update to ensure sources are set
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { 
                ...msg, 
                sources: response.sources,
                sessionId: response.sessionId 
              }
            : msg
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error sending message';
      setError(errorMessage);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: 'Lo siento, hubo un error procesando tu solicitud. Por favor intenta nuevamente.',
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setStreamingMessageId(null);
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