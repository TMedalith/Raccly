'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Loader2, TrendingUp, BarChart3, Microscope, Rocket, Dna, Zap, FileText } from 'lucide-react';
import { OwlLogo } from '@/shared/components/OwlIcons';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage?: (message: string) => void;
}

export function MessageList({ messages, isLoading, onSendMessage }: MessageListProps) {
  const suggestedQuestions = [
    {
      icon: TrendingUp,
      text: '¿Qué efectos tiene la microgravedad en el crecimiento de plantas?',
    },
    {
      icon: BarChart3,
      text: '¿Cómo afecta el vuelo espacial a la densidad ósea en ratones?',
    },
    {
      icon: Microscope,
      text: 'Últimos hallazgos en mecanismos moleculares de COVID-19',
    },
    {
      icon: Rocket,
      text: 'Mecanismos de gravitropismo en Arabidopsis',
    },
    {
      icon: Dna,
      text: 'Atrofia muscular esquelética en misiones espaciales',
    },
    {
      icon: Zap,
      text: 'Efectos de la radiación en sistemas biológicos',
    },
  ];

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-[#d4f78a] border-2 border-slate-900 flex items-center justify-center mb-4 mx-auto">
            <OwlLogo className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 font-[family-name:var(--font-space-grotesk)]">
            ¿Qué quieres investigar hoy?
          </h2>
          <p className="text-slate-600 font-[family-name:var(--font-inter)]">
            Pregunta sobre papers, tendencias o comparaciones
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full space-y-3"
        >
          <h3 className="text-sm font-semibold text-slate-700 font-[family-name:var(--font-space-grotesk)]">
            Preguntas sugeridas:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedQuestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSendMessage?.(suggestion.text)}
                  className="p-4 bg-white border-2 border-slate-900 rounded-2xl text-left transition-all hover:bg-[#d4f78a] group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#d4f78a] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-sm text-slate-900 flex-1 leading-relaxed font-[family-name:var(--font-inter)]">
                      {suggestion.text}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AnimatePresence>
        {messages.map((message) => {
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  message.role === 'user'
                    ? 'bg-[#d4f78a] border-2 border-slate-900'
                    : 'bg-white border-2 border-slate-900'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-slate-900" />
                ) : (
                  <OwlLogo className="w-6 h-6" />
                )}
              </div>

              {/* Message content */}
              <div
                className={`flex-1 rounded-2xl px-5 py-4 shadow-sm transition-all break-words ${
                  message.role === 'user'
                    ? 'bg-[#d4f78a] text-slate-900 font-medium border-2 border-slate-900'
                    : 'bg-white border-2 border-slate-900'
                }`}
              >
                {message.content.length === 0 ? (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Buscando información...</span>
                  </div>
                ) : (
                  <>
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${message.role === 'assistant' ? 'text-slate-900' : ''}`}>
                      {message.content}
                    </p>

                    {/* Sources section */}
                    {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-slate-600" />
                          <span className="text-xs font-semibold text-slate-700">
                            Fuentes ({message.sources.length})
                          </span>
                        </div>
                        <div className="space-y-2">
                          {message.sources.map((source, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs bg-slate-50 rounded-lg px-3 py-2 border border-slate-200"
                            >
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="text-slate-700 truncate">{source}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}