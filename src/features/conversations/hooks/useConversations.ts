'use client';

import { useState, useEffect, useCallback } from 'react';
import { conversationsService } from '../services/conversations.service';
import type { Conversation } from '../types';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await conversationsService.getRecent();

      if (response.success) {
        setConversations(response.data);
      } else {
        setError(response.error || 'Error al cargar conversaciones');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createConversation = useCallback(
    async (title: string): Promise<Conversation | null> => {
      try {
        const response = await conversationsService.create(title);
        if (response.success) {
          await fetchConversations();
          return response.data;
        }
        return null;
      } catch (err) {
        console.error('Error creating conversation:', err);
        return null;
      }
    },
    [fetchConversations]
  );

  const deleteConversation = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await conversationsService.deleteConversation(id);
        if (response.success) {
          await fetchConversations();
          return true;
        }
        return false;
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
