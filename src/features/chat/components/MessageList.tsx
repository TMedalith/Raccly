'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { resolvePaperReferences } from '@/shared/utils/paperReference';
import { CitedPapersSection } from './CitedPapersSection';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onMessageVisible?: (messageId: string | null) => void;
  activeMessageId?: string | null;
  onPaperClick?: (paperId: string) => void;
}

export function MessageList({ messages, isLoading, onMessageVisible, activeMessageId, onPaperClick }: MessageListProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Comienza una conversación
        </h2>
        <p className="text-blue-200 max-w-md">
          Ask about scientific papers, research concepts, or search for relevant literature.
        </p>
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
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  : 'bg-white/10 border-2 border-cyan-400'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-cyan-400" />
              )}
            </div>

            {}
            <div
              className={`flex-1 rounded-2xl px-5 py-4 shadow-sm transition-all ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium'
                  : message.id === activeMessageId && message.relatedPapers && message.relatedPapers.length > 0
                  ? 'bg-white/10 border-2 border-cyan-400 shadow-md backdrop-blur-xl'
                  : 'bg-white/5 border border-white/20 backdrop-blur-xl'
              }`}
            >
              <p className={`text-sm leading-relaxed ${message.role === 'assistant' ? 'text-white' : ''}`}>
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
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 border-2 border-cyan-400 flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1 rounded-2xl px-5 py-4 bg-white/5 border border-white/20 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-blue-200">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Buscando información...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
