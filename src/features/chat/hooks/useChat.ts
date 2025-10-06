import { useState, useCallback, useMemo, useEffect } from 'react';
import { chatService } from '../services/chat.service';
import { generateSessionId } from '@/shared/utils/session';
import { loadMessages, saveMessages } from '@/shared/utils/storage';
import { resolvePaperReferences } from '@/shared/utils/paperReference';
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
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);

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

    const citedPapers = useMemo(() => {
    if (activeMessageId) {
      const activeMessage = messages.find((m) => m.id === activeMessageId);
      if (activeMessage?.references && activeMessage.references.length > 0) {
        return resolvePaperReferences(activeMessage.references);
      }
    }

        for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant' && messages[i].references) {
        return resolvePaperReferences(messages[i].references || []);
      }
    }
    return [];
  }, [messages, activeMessageId]);

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
        relatedPapers: response.papers,
        sessionId: response.sessionId,
        agentAliasId: response.agentAliasId,
        references: response.references,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error sending message';
      setError(errorMessage);

      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
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

    const setActiveMessage = useCallback((messageId: string | null) => {
    setActiveMessageId(messageId);
  }, []);

    const selectPaper = useCallback((paperId: string | null) => {
    setSelectedPaperId(paperId);
  }, []);

  return {
    messages,
    isLoading,
    error,
    currentPapers,
    citedPapers,
    activeMessageId,
    sessionId,
    selectedPaperId,
    sendMessage,
    clearMessages,
    loadConversation,
    setActiveMessage,
    selectPaper,
  };
}
