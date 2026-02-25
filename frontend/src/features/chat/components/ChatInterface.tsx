'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUp, WifiOff, Menu, BookOpen, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageList } from './MessageList';
import { ConversationSidebar } from './ConversationSidebar';
import { SourcesPanel } from './SourcesPanel';
import { useChat } from '../hooks/useChat';
import type { PaperSource } from '../types';

interface ChatInterfaceProps {
  conversationId?: string;
  initialQuery?: string;
}

export function ChatInterface({ conversationId, initialQuery }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const [backendDown, setBackendDown] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [vw, setVw] = useState(1400);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [sourcesOverlayOpen, setSourcesOverlayOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage, sessionId } = useChat({ conversationId });
  const hasProcessedInitialQuery = useRef(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const isMobile = vw < 768;
  const isTablet = vw >= 768 && vw < 1100;
  const isDesktop = vw >= 1100;

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setSidebarDrawerOpen(false);
      setSourcesOverlayOpen(false);
    }
  }, [isDesktop]);

  const [currentSources, setCurrentSources] = useState<(string | PaperSource)[]>([]);

  const updateVisibleSources = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const els = Array.from(container.querySelectorAll<HTMLElement>('[data-sources-id]'));
    if (!els.length) return;
    const cr = container.getBoundingClientRect();
    let best: HTMLElement | null = null;
    let bestScore = Infinity;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.bottom < cr.top || r.top > cr.bottom) continue;
      const score = Math.abs(r.top - cr.top - cr.height * 0.2);
      if (score < bestScore) { bestScore = score; best = el; }
    }
    if (best) {
      const mid = best.dataset.sourcesId!;
      const msg = messagesRef.current.find(m => m.id === mid);
      if (msg?.sources) setCurrentSources(msg.sources);
    }
  }, []);

  useEffect(() => {
    const lastAssistant = [...messages].reverse().find(
      m => m.role === 'assistant' && m.sources && m.sources.filter(s => typeof s !== 'string').length > 0
    );
    if (lastAssistant?.sources) setCurrentSources(lastAssistant.sources);
  }, [messages]);

  useEffect(() => {
    const t = setTimeout(updateVisibleSources, 60);
    return () => clearTimeout(t);
  }, [messages, updateVisibleSources]);

  const sourcePaperCount = currentSources.filter(s => typeof s !== 'string').length;

  useEffect(() => {
    const check = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';
        const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(4000) });
        setBackendDown(!res.ok);
      } catch {
        setBackendDown(true);
      }
    };
    check();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && !hasProcessedInitialQuery.current && sessionId) {
      hasProcessedInitialQuery.current = true;
      sendMessage(initialQuery);
    }
  }, [initialQuery, sendMessage, sessionId]);

  useEffect(() => {
    const ta = inputRef.current;
    if (ta) {
      ta.style.height = '24px';
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const msg = input;
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 0);
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = messages.length > 0;
  const showSidebarInline = isDesktop || isTablet;

  return (
    <>
      <style>{`
        .chat-input-box {
          background: var(--bg-2);
          border: 1px solid var(--border-2);
          border-radius: 18px;
          padding: 14px 14px 14px 20px;
          display: flex;
          align-items: flex-end;
          gap: 10px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .chat-input-box.focused {
          border-color: rgba(200,245,62,0.35);
          box-shadow: 0 0 0 3px rgba(200,245,62,0.06);
        }
        .send-btn {
          flex-shrink: 0;
          width: 38px; height: 38px;
          border-radius: 12px;
          border: none;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
          cursor: pointer;
        }
        .send-btn:disabled { cursor: not-allowed; }
      `}</style>

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>

        <AnimatePresence>
          {(sidebarDrawerOpen || sourcesOverlayOpen) && !isDesktop && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => { setSidebarDrawerOpen(false); setSourcesOverlayOpen(false); }}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(3px)',
                zIndex: 40,
              }}
            />
          )}
        </AnimatePresence>

        {showSidebarInline ? (
          <AnimatePresence mode="wait" initial={false}>
            {sidebarCollapsed ? (
              <motion.div
                key="sidebar-strip"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  width: '44px', flexShrink: 0, height: '100%',
                  background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  paddingTop: '13px',
                }}
              >
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  title="Open sidebar"
                  style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: 'var(--bg-3)', border: '1px solid var(--border)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', transition: 'opacity 0.15s',
                  }}
                  onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.7')}
                  onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
                >
                  <PanelLeftOpen size={14} style={{ color: 'var(--text-3)' }} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="sidebar-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <ConversationSidebar
                  currentId={sessionId}
                  onCollapse={() => setSidebarCollapsed(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            {sidebarDrawerOpen && (
              <motion.div
                key="sidebar-drawer"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                style={{ position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 50 }}
              >
                <ConversationSidebar
                  currentId={sessionId}
                  isOverlay
                  onClose={() => setSidebarDrawerOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, background: 'var(--bg)' }}>
          <div
            style={{
              padding: isMobile ? '10px 16px' : '12px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(12,12,15,0.9)', backdropFilter: 'blur(16px)',
              flexShrink: 0, gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isMobile && (
                <button
                  onClick={() => setSidebarDrawerOpen(true)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '9px',
                    background: 'var(--bg-3)', border: '1px solid var(--border)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  <Menu size={15} style={{ color: 'var(--text-2)' }} />
                </button>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {!isDesktop && hasMessages && (
                <button
                  onClick={() => setSourcesOverlayOpen(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '5px 11px',
                    background: sourcePaperCount > 0 ? 'var(--accent-dim)' : 'var(--bg-3)',
                    border: `1px solid ${sourcePaperCount > 0 ? 'rgba(200,245,62,0.25)' : 'var(--border)'}`,
                    borderRadius: '999px', cursor: 'pointer',
                    fontSize: '11px', fontWeight: 600,
                    color: sourcePaperCount > 0 ? 'var(--accent)' : 'var(--text-3)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <BookOpen size={11} />
                  {sourcePaperCount > 0 ? `${sourcePaperCount} refs` : 'Refs'}
                </button>
              )}
            </div>
          </div>

          {backendDown && (
            <div
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 20px',
                background: 'rgba(255,80,80,0.07)',
                borderBottom: '1px solid rgba(255,80,80,0.18)',
              }}
            >
              <WifiOff size={14} style={{ color: '#ff6b6b', flexShrink: 0 }} />
              <p style={{ fontSize: '12px', color: '#ff9a9a', margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: '#ff6b6b' }}>Backend unreachable.</strong>{' '}
                Make sure the API server is running and the Qdrant cluster is active at{' '}
                <a href="https://cloud.qdrant.io" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#ff6b6b', textDecoration: 'underline' }}>
                  cloud.qdrant.io
                </a>.
              </p>
              <button
                onClick={() => setBackendDown(false)}
                style={{
                  marginLeft: 'auto', flexShrink: 0, background: 'transparent',
                  border: 'none', cursor: 'pointer', fontSize: '18px',
                  lineHeight: 1, color: '#ff6b6b', padding: '0 4px',
                }}
              >×</button>
            </div>
          )}

          <div
            ref={messagesContainerRef}
            onScroll={updateVisibleSources}
            style={{
              flex: 1, overflowY: 'auto',
              padding: hasMessages ? (isMobile ? '20px 16px 0' : '32px 24px 0') : '0',
            }}
          >
            {!hasMessages ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '640px', padding: isMobile ? '0 16px 80px' : '0 24px 80px' }}>
                  <MessageList messages={messages} onSendMessage={sendMessage} />
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
                <MessageList messages={messages} onSendMessage={sendMessage} />
                <div ref={messagesEndRef} style={{ height: '32px' }} />
              </div>
            )}
          </div>

          <div style={{ flexShrink: 0, padding: isMobile ? '12px 16px 16px' : '16px 24px 22px', background: 'var(--bg)' }}>
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              <div className={`chat-input-box${focused ? ' focused' : ''}`}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Ask about NASA bioscience research…"
                  rows={1}
                  style={{
                    flex: 1, resize: 'none',
                    background: 'transparent', border: 'none', outline: 'none',
                    fontSize: '14px', color: 'var(--text)',
                    fontFamily: 'var(--font-body)',
                    lineHeight: '1.5', minHeight: '24px', maxHeight: '160px',
                  }}
                />
                <AnimatePresence mode="wait">
                  <motion.button
                    key={isLoading ? 'loading' : input.trim() ? 'active' : 'idle'}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="send-btn"
                    style={{
                      background: input.trim() && !isLoading ? 'var(--accent)' : 'var(--bg-4)',
                      color: input.trim() && !isLoading ? '#0c0c0f' : 'var(--text-3)',
                    }}
                  >
                    {isLoading ? (
                      <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--text-3)' }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    ) : (
                      <ArrowUp size={16} />
                    )}
                  </motion.button>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {isDesktop && hasMessages && (
          <SourcesPanel
            sources={currentSources}
            isLoading={isLoading}
            open={sourcesOpen}
            onToggle={() => setSourcesOpen(v => !v)}
          />
        )}

        <AnimatePresence>
          {!isDesktop && sourcesOverlayOpen && hasMessages && (
            <motion.div
              key="sources-overlay"
              initial={{ x: 340 }}
              animate={{ x: 0 }}
              exit={{ x: 340 }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              style={{ position: 'fixed', right: 0, top: 0, height: '100vh', zIndex: 50 }}
            >
              <SourcesPanel
                sources={currentSources}
                isLoading={isLoading}
                open={true}
                onToggle={() => setSourcesOverlayOpen(false)}
                isOverlay
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
