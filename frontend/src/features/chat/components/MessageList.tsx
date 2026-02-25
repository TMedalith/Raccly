'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Microscope, Rocket, Dna, Zap, FlaskConical, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  onSendMessage?: (message: string) => void;
}

const SUGGESTIONS = [
  { icon: TrendingUp,   text: 'Effects of microgravity on plant growth',   tag: 'Botany' },
  { icon: Dna,          text: 'DNA repair mechanisms under radiation',       tag: 'Genetics' },
  { icon: Microscope,   text: 'Bone density changes during spaceflight',     tag: 'Physiology' },
  { icon: Rocket,       text: 'Gravitropism mechanisms in Arabidopsis',      tag: 'Biology' },
  { icon: Zap,          text: 'Skeletal muscle atrophy in space missions',   tag: 'Medicine' },
  { icon: FlaskConical, text: 'Immune system changes in microgravity',       tag: 'Immunology' },
];

function EmptyState({ onSendMessage }: { onSendMessage?: (m: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ textAlign: 'center' }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 3vw, 26px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.15,
            marginBottom: '8px',
          }}
        >
          <span style={{ color: 'var(--text)' }}>What do you want </span>
          <span style={{ color: 'var(--accent)' }}>to research?</span>
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.5, margin: 0 }}>
          Cited answers grounded in 608 NASA bioscience papers.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px', width: '100%' }}
      >
        {SUGGESTIONS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 + i * 0.04 }}
              onClick={() => onSendMessage?.(s.text)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px',
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
                minWidth: 0, overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = 'rgba(200,245,62,0.3)';
                el.style.background = 'var(--bg-3)';
              }}
              onMouseOut={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = 'var(--border)';
                el.style.background = 'var(--bg-2)';
              }}
            >
              <div
                style={{
                  flexShrink: 0, width: '24px', height: '24px', borderRadius: '7px',
                  background: 'var(--accent-dim)', border: '1px solid rgba(200,245,62,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon size={11} style={{ color: 'var(--accent)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '9px', fontWeight: 700, color: 'var(--text-3)',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                  marginBottom: '1px',
                }}>
                  {s.tag}
                </div>
                <div style={{
                  fontSize: '11.5px', color: 'var(--text-2)', lineHeight: 1.3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {s.text}
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0' }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
        />
      ))}
      <span style={{ fontSize: '12px', color: 'var(--text-3)', marginLeft: '4px' }}>
        Searching papers
      </span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      title="Copy response"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '3px 8px', borderRadius: '6px',
        background: copied ? 'rgba(200,245,62,0.08)' : 'var(--bg-3)',
        border: `1px solid ${copied ? 'rgba(200,245,62,0.2)' : 'var(--border)'}`,
        cursor: 'pointer', fontSize: '11px',
        color: copied ? 'var(--accent)' : 'var(--text-3)',
        fontFamily: 'var(--font-body)',
        transition: 'all 0.15s',
      }}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function MessageList({ messages, onSendMessage }: MessageListProps) {
  if (messages.length === 0) {
    return <EmptyState onSendMessage={onSendMessage} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            {...(message.role === 'assistant' &&
              message.sources &&
              message.sources.filter(s => typeof s !== 'string').length > 0
                ? { 'data-sources-id': message.id }
                : {})}
          >
            {message.role === 'user' ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    maxWidth: '72%',
                    padding: '12px 16px',
                    background: 'var(--bg-3)',
                    border: '1px solid var(--border-2)',
                    borderRadius: '16px 16px 4px 16px',
                    fontSize: '14px', lineHeight: 1.65,
                    color: 'var(--text)', wordBreak: 'break-word',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {message.content}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    flexShrink: 0, width: '30px', height: '30px', borderRadius: '9px',
                    background: 'var(--accent-dim)', border: '1px solid rgba(200,245,62,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 800, color: 'var(--accent)',
                    fontFamily: 'var(--font-display)', marginTop: '2px',
                  }}
                >
                  R
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {message.content.length === 0 ? (
                    <ThinkingDots />
                  ) : (
                    <>
                      <div className="raccly-prose">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>

                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CopyButton text={message.content} />

                        {message.sources && message.sources.filter(s => typeof s !== 'string').length > 0 && (
                          <span
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              padding: '3px 9px', borderRadius: '6px',
                              background: 'var(--bg-3)',
                              border: '1px solid var(--border)',
                              fontSize: '11px', color: 'var(--text-3)',
                              fontFamily: 'var(--font-body)',
                            }}
                          >
                            <span
                              style={{
                                width: '5px', height: '5px', borderRadius: '50%',
                                background: 'var(--accent)', display: 'inline-block',
                                flexShrink: 0,
                              }}
                            />
                            {message.sources.filter(s => typeof s !== 'string').length} references
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
