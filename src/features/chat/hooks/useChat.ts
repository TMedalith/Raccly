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
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize session ID - Use existing conversationId or create new
  useEffect(() => {
    // If conversationId is already a valid session ID, use it directly
    // Otherwise create a new session
    const id = options?.conversationId || generateSessionId();
    setSessionId(id);

    // Load persisted messages for this session
    const persistedMessages = loadMessages(id);
    if (persistedMessages.length > 0) {
      setMessages(persistedMessages);
    }
  }, [options?.conversationId]);

  // Persist messages to localStorage for all conversations
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      saveMessages(sessionId, messages);
    }
  }, [messages, sessionId]);

  /**
   * Obtiene los papers del mensaje activo o del último mensaje del asistente
   */
  const currentPapers = useMemo(() => {
        if (activeMessageId) {
      const activeMessage = messages.find((m) => m.id === activeMessageId);
      if (activeMessage?.relatedPapers) {
        return activeMessage.relatedPapers;
      }
    }

        for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant' && messages[i].relatedPapers) {
        return messages[i].relatedPapers || [];
      }
    }
    return [];
  }, [messages, activeMessageId]);

  /**
   * Envía un mensaje del usuario y recibe la respuesta del asistente
   */
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

      // Update session ID if it changed
      if (response.sessionId && response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        relatedPapers: response.papers,
        sessionId: response.sessionId,
        agentAliasId: response.agentAliasId,
        references: response.references,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar mensaje';
      setError(errorMessage);

      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId]);

  /**
   * Limpia todos los mensajes
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    if (sessionId) {
      saveMessages(sessionId, []);
    }
  }, [sessionId]);

  /**
   * Carga el historial de una conversación
   */
  const loadConversation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const history = await chatService.getConversationHistory();
      setMessages(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar conversación');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Establece el mensaje activo (el que está visible en el viewport)
   */
  const setActiveMessage = useCallback((messageId: string | null) => {
    setActiveMessageId(messageId);
  }, []);

  return {
    messages,
    isLoading,
    error,
    currentPapers,
    activeMessageId,
    sessionId,
    sendMessage,
    clearMessages,
    loadConversation,
    setActiveMessage,
  };
}
