'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Mic, TrendingUp, BarChart3, Building2, Clock } from 'lucide-react';
import { ChatInterface } from '@/features/chat/components/ChatInterface';

const suggestions = [
  {
    icon: TrendingUp,
    text: 'Avances en Alzheimer 2024',
    color: 'from-[#FFF0ED] to-white',
  },
  {
    icon: BarChart3,
    text: 'Compara estudios sobre CRISPR',
    color: 'from-[#FFF0ED] to-white',
  },
  {
    icon: Building2,
    text: '¿Qué instituciones lideran en IA?',
    color: 'from-[#FFF0ED] to-white',
  },
  {
    icon: Clock,
    text: 'Timeline de inmunoterapia',
    color: 'from-[#FFF0ED] to-white',
  },
];

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  const searchQuery = searchParams.get('q');

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (text: string) => {
    router.push(`/chat?q=${encodeURIComponent(text)}`);
  };

    if (searchQuery) {
    return <ChatInterface initialQuery={searchQuery} showRelatedPapers={true} />;
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-[700px] space-y-10">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center space-y-3"
        >
          <h1 className="text-4xl font-bold text-[#4A4A4A]">
            ¿Qué quieres investigar hoy?
          </h1>
          <p className="text-lg text-[#9E9E9E]">
            Pregúntame sobre papers, tendencias o comparaciones
          </p>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-3"
        >
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="Escribe tu pregunta aquí..."
              className="w-full px-6 py-4 pr-14 text-lg border-2 border-[#FFD9D0] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FFB5A7]/20 focus:border-[#FFB5A7] transition-all bg-white/80 backdrop-blur-sm"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-[#FFF0ED] rounded-lg transition-colors"
            >
              <Mic className="w-5 h-5 text-[#9E9E9E]" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            disabled={!query.trim()}
            className="w-full py-3 bg-[#FFB5A7] text-[#4A4A4A] font-semibold rounded-xl shadow-md hover:bg-[#FF8B7A] hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#E0E0E0]"
          >
            <div className="flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Buscar
            </div>
          </motion.button>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-[#9E9E9E]">
            <span className="text-xl">💡</span>
            <h2 className="text-sm font-semibold">Prueba preguntar:</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className={`p-4 bg-gradient-to-br ${suggestion.color} border border-[#FFD9D0]/50 rounded-xl text-left transition-all hover:shadow-md group`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/70 rounded-lg group-hover:bg-white transition-colors">
                      <Icon className="w-5 h-5 text-[#4A4A4A]" />
                    </div>
                    <p className="text-sm font-medium text-[#4A4A4A] leading-relaxed flex-1">
                      {suggestion.text}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
