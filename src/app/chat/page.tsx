'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, TrendingUp, BarChart3, Building2, Clock } from 'lucide-react';
import { ChatInterface } from '@/features/chat/components/ChatInterface';
import { ConversationList } from '@/features/conversations/components/ConversationList';
import { useConversations } from '@/features/conversations/hooks/useConversations';

const suggestions = [
  {
    icon: TrendingUp,
    text: 'Mars rover discoveries 2024',
    color: 'from-[var(--secondary)] to-white',
  },
  {
    icon: BarChart3,
    text: 'Compare SpaceX and NASA missions',
    color: 'from-[var(--secondary)] to-white',
  },
  {
    icon: Building2,
    text: 'Latest James Webb telescope findings',
    color: 'from-[var(--secondary)] to-white',
  },
  {
    icon: Clock,
    text: 'Artemis program timeline',
    color: 'from-[var(--secondary)] to-white',
  },
];

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const { createConversation } = useConversations();

  const searchQuery = searchParams.get('q');
  const sessionId = searchParams.get('session');

  const handleSearch = () => {
    if (query.trim()) {
      const newConversation = createConversation(query.trim());
      router.push(`/chat?session=${newConversation.id}&q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (text: string) => {
    const newConversation = createConversation(text);
    router.push(`/chat?session=${newConversation.id}&q=${encodeURIComponent(text)}`);
  };

  // Show chat interface if there's a search query or a session ID
  if (searchQuery || sessionId) {
    return <ChatInterface conversationId={sessionId || undefined} initialQuery={searchQuery || undefined} showRelatedPapers={true} />;
  }

  return (
    <div className="h-full overflow-hidden flex items-center justify-center p-8">
      <div className="w-full max-w-[800px] space-y-8">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            ¿Qué quieres investigar hoy?
          </h1>
          <p className="text-base text-[var(--muted-foreground)]">
            Pregúntame sobre papers, tendencias o comparaciones
          </p>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-2"
        >
          <div className="relative flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="Escribe tu pregunta aquí..."
              className="flex-1 px-5 py-3 text-base border-2 border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all bg-white"
            />
            <button
              onClick={handleSearch}
              disabled={!query.trim()}
              className="px-6 py-3 bg-[var(--primary)] text-white font-medium rounded-xl hover:bg-[var(--navy)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Buscar
            </button>
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
            Prueba preguntar:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="p-3 bg-white border border-[var(--border)] rounded-lg text-left transition-all hover:border-[var(--primary)] hover:shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                    <p className="text-sm text-[var(--foreground)] flex-1">
                      {suggestion.text}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Historial de conversaciones */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
            Conversaciones recientes:
          </h2>

          <div className="border border-[var(--border)] rounded-lg p-2 bg-white max-h-[200px] overflow-y-auto">
            <ConversationList />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-[var(--muted-foreground)]">Cargando...</div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
