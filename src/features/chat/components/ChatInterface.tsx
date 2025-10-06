'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { MessageList } from './MessageList';
import { RelatedPapersList } from './RelatedPapersList';
import { useChat } from '../hooks/useChat';
import { useAudio } from '@/shared/hooks/useAudio';

interface ChatInterfaceProps {
  conversationId?: string;
  showRelatedPapers?: boolean;
  initialQuery?: string;
}

export function ChatInterface({ conversationId, showRelatedPapers = true, initialQuery }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, isLoading, currentPapers, citedPapers, sendMessage, setActiveMessage, activeMessageId, sessionId, selectedPaperId, selectPaper } = useChat({ conversationId });
  const hasProcessedInitialQuery = useRef(false);
  const { play } = useAudio();

    useEffect(() => {
    if (initialQuery && !hasProcessedInitialQuery.current && sessionId) {
      hasProcessedInitialQuery.current = true;
      sendMessage(initialQuery);
    }
  }, [initialQuery, sendMessage, sessionId]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    play(['Understood.mp3', 'Processing.mp3']);
    const messageToSend = input;
    setInput('');
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full gap-6">
      {}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            onMessageVisible={setActiveMessage}
            activeMessageId={activeMessageId}
            onPaperClick={selectPaper}
          />
        </div>

        {}
        <div className="border-t border-[var(--border)] bg-white/80 backdrop-blur-sm px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about scientific papers..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                style={{ maxHeight: '200px', minHeight: '48px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 rounded-xl bg-[var(--primary)] p-3 text-white hover:bg-[var(--navy)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {}
      {showRelatedPapers && (
        <div className="w-80 flex-shrink-0 border-l border-[var(--border)] bg-white/50 backdrop-blur-sm overflow-y-auto custom-scrollbar">
          <RelatedPapersList papers={currentPapers} citedPapers={citedPapers} isLoading={isLoading} selectedPaperId={selectedPaperId} />
        </div>
      )}
    </div>
  );
}
