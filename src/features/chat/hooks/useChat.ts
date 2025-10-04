import { useState, useCallback, useMemo } from 'react';
import { chatService } from '../services/chat.service';
import type { Message } from '../types';
import type { Paper } from '@/features/papers/types';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

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
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

        const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
            const response = await chatService.sendMessage(content);

            const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        relatedPapers: response.papers,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar mensaje');

            const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  /**
   * Limpia todos los mensajes
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  /**
   * Carga el historial de una conversación
   */
  const loadConversation = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const history = await chatService.getConversationHistory(conversationId);
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
    sendMessage,
    clearMessages,
    loadConversation,
    setActiveMessage,
  };
}
