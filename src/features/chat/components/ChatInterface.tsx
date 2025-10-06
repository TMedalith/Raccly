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
    <div className="flex h-screen gap-6 bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27] pt-24">
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
        <div className="border-t border-white/20 bg-white/5 backdrop-blur-xl px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about scientific papers..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all"
                style={{ maxHeight: '200px', minHeight: '48px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 p-3 text-white hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {}
      {showRelatedPapers && (
        <div className="w-80 flex-shrink-0 border-l border-white/20 bg-white/5 backdrop-blur-xl overflow-y-auto custom-scrollbar">
          <RelatedPapersList papers={currentPapers} citedPapers={citedPapers} isLoading={isLoading} selectedPaperId={selectedPaperId} />
        </div>
      )}
    </div>
  );
}
