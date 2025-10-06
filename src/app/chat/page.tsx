'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, TrendingUp, BarChart3, Building2, Clock } from 'lucide-react';
import { ChatInterface } from '@/features/chat/components/ChatInterface';
import { ConversationList } from '@/features/conversations/components/ConversationList';
import { useConversations } from '@/features/conversations/hooks/useConversations';
import { useAudio } from '@/shared/hooks/useAudio';

const suggestions = [
  {
    icon: TrendingUp,
    text: 'What are the effects of microgravity on plant growth?',
    color: 'from-[#22D3EE] to-[#3B82F6]',
    iconBg: 'bg-gradient-to-br from-[#22D3EE] to-[#3B82F6]',
  },
  {
    icon: BarChart3,
    text: 'How does spaceflight affect bone density in mice?',
    color: 'from-[#C084FC] to-[#EC4899]',
    iconBg: 'bg-gradient-to-br from-[#C084FC] to-[#EC4899]',
  },
  {
    icon: Building2,
    text: 'Latest findings in COVID-19 molecular mechanisms',
    color: 'from-[#4ADE80] to-[#10B981]',
    iconBg: 'bg-gradient-to-br from-[#4ADE80] to-[#10B981]',
  },
  {
    icon: Clock,
    text: 'Arabidopsis gravitropism mechanisms',
    color: 'from-[#FBBF24] to-[#F59E0B]',
    iconBg: 'bg-gradient-to-br from-[#FBBF24] to-[#F59E0B]',
  },
  {
    icon: Search,
    text: 'Skeletal muscle atrophy in space missions',
    color: 'from-[#EC4899] to-[#8B5CF6]',
    iconBg: 'bg-gradient-to-br from-[#EC4899] to-[#8B5CF6]',
  },
  {
    icon: TrendingUp,
    text: 'Radiation effects on biological systems',
    color: 'from-[#F97316] to-[#DC2626]',
    iconBg: 'bg-gradient-to-br from-[#F97316] to-[#DC2626]',
  },
];

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const { createConversation } = useConversations();
  const { play } = useAudio();

  const searchQuery = searchParams.get('q');
  const sessionId = searchParams.get('session');

  const handleSearch = () => {
    if (query.trim()) {
      play(['Understood.mp3', 'Processing.mp3']);
      const newConversation = createConversation(query.trim());
      router.push(`/chat?session=${newConversation.id}&q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (text: string) => {
    play(['Understood.mp3', 'Processing.mp3']);
    const newConversation = createConversation(text);
    router.push(`/chat?session=${newConversation.id}&q=${encodeURIComponent(text)}`);
  };

    if (searchQuery || sessionId) {
    return <ChatInterface conversationId={sessionId || undefined} initialQuery={searchQuery || undefined} showRelatedPapers={true} />;
  }

  return (
    <div className="h-full overflow-hidden flex items-center justify-center p-8 bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27]">
      <div className="w-full max-w-[800px] space-y-8">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-orbitron)]">
            What do you want to research today?
          </h1>
          <p className="text-lg text-blue-200 font-[family-name:var(--font-space-grotesk)]">
            Ask me about papers, trends, or comparisons
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
              placeholder="Type your question here..."
              className="flex-1 px-6 py-4 text-base border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all bg-white/5 backdrop-blur-xl text-white placeholder:text-blue-200/50"
            />
            <button
              onClick={handleSearch}
              disabled={!query.trim()}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-2xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-sm font-semibold text-blue-200 font-[family-name:var(--font-space-grotesk)]">
            Suggested Research Questions:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="p-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl text-left transition-all hover:border-white/40 hover:shadow-lg hover:shadow-cyan-500/20 group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${suggestion.iconBg} flex-shrink-0 shadow-md`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm text-white flex-1 leading-relaxed">
                      {suggestion.text}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

                <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-semibold text-blue-200 font-[family-name:var(--font-space-grotesk)]">
            Recent Conversations:
          </h2>

          <div className="border border-white/20 rounded-2xl p-3 bg-white/5 backdrop-blur-xl max-h-[200px] overflow-y-auto custom-scrollbar">
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
