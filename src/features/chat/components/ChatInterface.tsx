'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { MessageList } from './MessageList';
import { RelatedPapersList } from './RelatedPapersList';
import { useChat } from '../hooks/useChat';

interface ChatInterfaceProps {
  conversationId?: string;
  showRelatedPapers?: boolean;
  initialQuery?: string;
}

export function ChatInterface({ conversationId, showRelatedPapers = true, initialQuery }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, currentPapers, citedPapers, sendMessage, setActiveMessage, activeMessageId, sessionId, selectedPaperId, selectPaper } = useChat({ conversationId });
  const hasProcessedInitialQuery = useRef(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && !hasProcessedInitialQuery.current && sessionId) {
      hasProcessedInitialQuery.current = true;
      sendMessage(initialQuery);
    }
  }, [initialQuery, sendMessage, sessionId]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = '48px'; // Reset to min height
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = Math.min(scrollHeight, 200) + 'px'; // Max 200px
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageToSend = input;
    setInput('');
    
    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-[radial-gradient(circle_at_center,_white_0%,_#fef9c3_100%)] pt-24 ml-20 overflow-hidden">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Scrollable messages area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            /* Empty state with centered content */
            <div className="h-full flex items-center justify-center">
              <div className="w-full max-w-2xl px-6">
                <MessageList
                  messages={messages}
                  isLoading={isLoading}
                  onMessageVisible={setActiveMessage}
                  activeMessageId={activeMessageId}
                  onPaperClick={selectPaper}
                  onSendMessage={sendMessage}
                />
              </div>
            </div>
          ) : (
            /* Chat view with messages */
            <div className="py-8">
              <div className="max-w-4xl mx-auto w-full px-6">
                <MessageList
                  messages={messages}
                  isLoading={isLoading}
                  onMessageVisible={setActiveMessage}
                  activeMessageId={activeMessageId}
                  onPaperClick={selectPaper}
                  onSendMessage={sendMessage}
                />
                {/* Invisible element for auto-scroll */}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Input area - fixed at bottom */}
        <div className="flex-shrink-0 py-4 bg-[radial-gradient(circle_at_center,_white_0%,_#fef9c3_100%)] border-t border-slate-200">
          <div className="max-w-4xl mx-auto w-full px-6">
            <div className="relative flex items-center gap-3 bg-white rounded-3xl border-2 border-slate-900 p-2 shadow-lg">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about scientific papers..."
                rows={1}
                className="flex-1 resize-none bg-transparent px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none font-[family-name:var(--font-inter)] overflow-hidden"
                style={{ height: '48px', maxHeight: '200px', minHeight: '48px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 rounded-2xl bg-[#d4f78a] border-2 border-slate-900 p-3 text-slate-900 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 font-semibold"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
