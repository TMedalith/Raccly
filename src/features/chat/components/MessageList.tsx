'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Loader2, TrendingUp, BarChart3, Microscope, Rocket, Dna, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { resolvePaperReferences } from '@/shared/utils/paperReference';
import { CitedPapersSection } from './CitedPapersSection';
import { OwlLogo } from '@/shared/components/OwlIcons';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onMessageVisible?: (messageId: string | null) => void;
  activeMessageId?: string | null;
  onPaperClick?: (paperId: string) => void;
  onSendMessage?: (message: string) => void;
}

export function MessageList({ messages, isLoading, onMessageVisible, activeMessageId, onPaperClick, onSendMessage }: MessageListProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const suggestedQuestions = [
    {
      icon: TrendingUp,
      text: 'What are the effects of microgravity on plant growth?',
    },
    {
      icon: BarChart3,
      text: 'How does spaceflight affect bone density in mice?',
    },
    {
      icon: Microscope,
      text: 'Latest findings in COVID-19 molecular mechanisms',
    },
    {
      icon: Rocket,
      text: 'Arabidopsis gravitropism mechanisms',
    },
    {
      icon: Dna,
      text: 'Skeletal muscle atrophy in space missions',
    },
    {
      icon: Zap,
      text: 'Radiation effects on biological systems',
    },
  ];

    useEffect(() => {
    if (!onMessageVisible) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
                let mostVisibleMessage: { id: string; ratio: number } | null = null;

        entries.forEach((entry) => {
          const messageId = entry.target.getAttribute('data-message-id');
          const isAssistant = entry.target.getAttribute('data-role') === 'assistant';
          const hasPapers = entry.target.getAttribute('data-has-papers') === 'true';

          if (messageId && isAssistant && hasPapers && entry.isIntersecting) {
            if (!mostVisibleMessage || entry.intersectionRatio > mostVisibleMessage.ratio) {
              mostVisibleMessage = { id: messageId, ratio: entry.intersectionRatio };
            }
          }
        });

        if (mostVisibleMessage !== null) {
          onMessageVisible((mostVisibleMessage as { id: string; ratio: number }).id);
        }
      },
      {
        threshold: [0.3, 0.5, 0.7, 1.0],         rootMargin: '-20% 0px -20% 0px',       }
    );

        messageRefs.current.forEach((element) => {
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [messages, onMessageVisible]);

    const setMessageRef = (id: string, element: HTMLDivElement | null) => {
    if (element) {
      messageRefs.current.set(id, element);
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    } else {
      messageRefs.current.delete(id);
    }
  };
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
            What do you want to research today?
          </h2>
          <p className="text-slate-600 font-[family-name:var(--font-inter)]">
            Ask about papers, trends, or comparisons
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full space-y-3"
        >
          <h3 className="text-sm font-semibold text-slate-700 font-[family-name:var(--font-space-grotesk)]">
            Suggested Research Questions:
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
        {messages.map((message) => (
          <motion.div
            key={message.id}
            ref={(el) => {
              if (message.role === 'assistant') {
                setMessageRef(message.id, el);
              }
            }}
            data-message-id={message.id}
            data-role={message.role}
            data-has-papers={message.relatedPapers && message.relatedPapers.length > 0}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {}
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

            {}
            <div
              className={`flex-1 rounded-2xl px-5 py-4 shadow-sm transition-all break-words ${
                message.role === 'user'
                  ? 'bg-[#d4f78a] text-slate-900 font-medium border-2 border-slate-900'
                  : message.id === activeMessageId && message.relatedPapers && message.relatedPapers.length > 0
                  ? 'bg-white border-2 border-slate-900 shadow-md'
                  : 'bg-white border-2 border-slate-900'
              }`}
            >
              <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${message.role === 'assistant' ? 'text-slate-900' : ''}`}>
                {message.content}
              </p>

                            {message.role === 'assistant' && message.references && message.references.length > 0 && (() => {
                const resolvedPapers = resolvePaperReferences(message.references);
                return resolvedPapers.length > 0 ? (
                  <CitedPapersSection papers={resolvedPapers} onPaperClick={onPaperClick} />
                ) : null;
              })()}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center">
              <OwlLogo className="w-6 h-6" />
            </div>
            <div className="flex-1 rounded-2xl px-5 py-4 bg-white border-2 border-slate-900">
              <div className="flex items-center gap-2 text-slate-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Searching information...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
