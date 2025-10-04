'use client';

import { motion } from 'framer-motion';
import { useConversations } from '../hooks/useConversations';
import { ConversationItem } from './ConversationItem';

export function ConversationList() {
  const {
    conversations,
    isLoading,
    error,
    refresh,
    deleteConversation,
  } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-9 bg-[var(--secondary)]/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-[var(--destructive)] mb-2">Error al cargar</p>
        <button
          onClick={refresh}
          className="text-sm text-[var(--primary)] hover:text-[var(--navy)]"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-[var(--muted-foreground)]">No hay conversaciones</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-1"
    >
      {conversations.slice(0, 10).map((conversation, index) => (
        <motion.div
          key={conversation.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ConversationItem
            conversation={conversation}
            onDelete={deleteConversation}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
