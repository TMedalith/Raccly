'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllConversations, clearSessionMessages } from '@/shared/utils/storage';
import { generateSessionId } from '@/shared/utils/session';
import type { Conversation } from '../types';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      const storedConversations = getAllConversations();
      const formatted: Conversation[] = storedConversations.map((conv) => ({
        id: conv.sessionId,
        title: conv.title,
        createdAt: conv.lastMessage,
        updatedAt: conv.lastMessage,
        userId: 'local-user',
      }));

      setConversations(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createConversation = useCallback(
    (title: string): Conversation => {
      const sessionId = generateSessionId();
      const now = new Date();
      const newConv: Conversation = {
        id: sessionId,
        title,
        createdAt: now,
        updatedAt: now,
        userId: 'local-user',
      };

      fetchConversations();
      return newConv;
    },
    [fetchConversations]
  );

  const deleteConversation = useCallback(
    (id: string): boolean => {
      try {
        clearSessionMessages(id);
        fetchConversations();
        return true;
      } catch (err) {
        console.error('Error deleting conversation:', err);
        return false;
      }
    },
    [fetchConversations]
  );

  const refresh = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    fetchConversations();

    // Listen for storage changes to refresh conversations
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'memoralab_messages') {
        fetchConversations();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event for same-window updates
    const handleLocalUpdate = () => {
      fetchConversations();
    };

    window.addEventListener('conversationsUpdated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('conversationsUpdated', handleLocalUpdate);
    };
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    refresh,
    createConversation,
    deleteConversation,
  };
}
