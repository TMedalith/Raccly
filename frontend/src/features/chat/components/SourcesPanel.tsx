'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ExternalLink, BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { PaperSource } from '../types';

interface SourcesPanelProps {
  sources: (string | PaperSource)[];
  isLoading?: boolean;
  open?: boolean;
  onToggle?: () => void;
  isOverlay?: boolean;
}

function SkeletonCard() {
  return (
    <div
      style={{
        padding: '11px 12px',
        background: 'var(--bg-3)',
        border: '1px solid var(--border)',
        borderRadius: '11px',
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'var(--bg-4)', animation: 'shimmer 1.4s ease infinite', flexShrink: 0 }} />
        <div style={{ flex: 1, height: '11px', borderRadius: '4px', background: 'var(--bg-4)', animation: 'shimmer 1.4s ease infinite' }} />
        <div style={{ width: '30px', height: '16px', borderRadius: '999px', background: 'var(--bg-4)', animation: 'shimmer 1.4s ease infinite', flexShrink: 0 }} />
      </div>
      <div style={{ height: '9px', width: '55%', borderRadius: '4px', background: 'var(--bg-4)', animation: 'shimmer 1.4s ease infinite 0.1s', marginLeft: '26px' }} />
      <div style={{ height: '32px', borderRadius: '6px', background: 'var(--bg-4)', animation: 'shimmer 1.4s ease infinite 0.2s', marginLeft: '26px' }} />
    </div>
  );
}

function SourceCard({ source, index }: { source: PaperSource; index: number }) {
  const handleView = () => {
    if (source.pmc_id) window.open(`https://www.ncbi.nlm.nih.gov/pmc/articles/${source.pmc_id}/pdf/`, '_blank');
    else if (source.doi) window.open(`https://doi.org/${source.doi}`, '_blank');
  };

  const hasSnippet = source.snippet && source.snippet.length > 10;

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.055, duration: 0.28 }}
      style={{
        padding: '11px 12px',
        background: 'var(--bg-3)',
        border: '1px solid var(--border)',
        borderRadius: '11px',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(200,245,62,0.2)';
        (e.currentTarget as HTMLDivElement).style.background = '#1c1c22';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-3)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
        <div style={{
          flexShrink: 0, width: '18px', height: '18px', borderRadius: '4px',
          background: 'var(--accent-dim)', border: '1px solid rgba(200,245,62,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px',
        }}>
          <FileText size={9} style={{ color: 'var(--accent)' }} />
        </div>
        <h4 style={{
          flex: 1, fontSize: '12px', fontWeight: 600, color: 'var(--text)',
          lineHeight: 1.4, margin: 0, fontFamily: 'var(--font-body)',
        }}>
          {source.title || source.source}
        </h4>
        
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', paddingLeft: '26px', flexWrap: 'wrap' }}>
        {source.authors && source.authors.length > 0 && (
          <span style={{ fontSize: '10px', color: 'var(--text-3)', lineHeight: 1.3, marginRight: '3px' }}>
            {source.authors.slice(0, 2).join(', ')}{source.authors.length > 2 ? ' et al.' : ''}
          </span>
        )}
        {source.year && (
          <span style={{ padding: '1px 6px', background: 'var(--bg-4)', border: '1px solid var(--border)', borderRadius: '999px', fontSize: '9px', color: 'var(--text-3)' }}>
            {source.year}
          </span>
        )}
        {source.journal && (
          <span style={{ padding: '1px 6px', background: 'rgba(200,245,62,0.06)', border: '1px solid rgba(200,245,62,0.12)', borderRadius: '999px', fontSize: '9px', color: 'var(--accent)' }}>
            {source.journal}
          </span>
        )}
      </div>

      {hasSnippet && (
        <p style={{
          margin: '0 0 9px', paddingLeft: '26px',
          fontSize: '11px', color: 'var(--text-2)',
          lineHeight: 1.55, fontStyle: 'normal',
        }}>
          {source.snippet!.slice(0, 190)}…
        </p>
      )}

      <div style={{ display: 'flex', gap: '5px', paddingLeft: '26px' }}>
        {(source.pmc_id || source.doi) && (
          <button
            onClick={handleView}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '3px 10px', background: 'var(--accent)', color: '#0c0c0f',
              border: 'none', borderRadius: '999px',
              fontSize: '10px', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            <BookOpen size={9} /> View
          </button>
        )}
        {source.doi && (
          <a
            href={`https://doi.org/${source.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '3px 10px', background: 'var(--bg-4)',
              border: '1px solid var(--border)', borderRadius: '999px',
              fontSize: '10px', color: 'var(--text-2)', textDecoration: 'none',
              fontFamily: 'var(--font-body)',
            }}
          >
            <ExternalLink size={9} /> DOI
          </a>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ isLoading }: { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '12px', padding: '40px 20px', textAlign: 'center', height: '100%',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '11px',
        background: 'var(--bg-3)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.45,
      }}>
        <BookOpen size={16} style={{ color: 'var(--text-3)' }} />
      </div>
      <div>
        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', margin: '0 0 4px' }}>No references yet</p>
        <p style={{ fontSize: '11px', color: 'var(--text-3)', lineHeight: 1.5, margin: 0 }}>
          Ask a question to see the papers used to generate the answer.
        </p>
      </div>
    </div>
  );
}

export function SourcesPanel({ sources, isLoading, open = true, onToggle, isOverlay }: SourcesPanelProps) {
  const paperSources = sources.filter((s): s is PaperSource => typeof s !== 'string');

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <motion.div
        animate={{ width: isOverlay ? 320 : open ? 320 : 44 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        style={{
          flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column',
          background: 'var(--bg-2)', borderLeft: '1px solid var(--border)', overflow: 'hidden',
        }}
      >
        <div style={{
          padding: open ? '12px 14px 10px' : '12px 0 10px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          gap: '8px', flexShrink: 0,
          background: 'rgba(12,12,15,0.85)',
          backdropFilter: 'blur(16px)', minHeight: '44px',
        }}>
          {open && (
            <>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px',
                letterSpacing: '-0.02em', color: 'var(--text-2)', whiteSpace: 'nowrap',
              }}>
                References
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AnimatePresence mode="wait">
                  {paperSources.length > 0 && (
                    <motion.span
                      key={paperSources.length}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        padding: '1px 7px', background: 'var(--accent-dim)',
                        border: '1px solid rgba(200,245,62,0.15)', borderRadius: '999px',
                        fontSize: '10px', fontWeight: 700, color: 'var(--accent)',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {paperSources.length}
                    </motion.span>
                  )}
                </AnimatePresence>
                <button
                  onClick={onToggle}
                  title={isOverlay ? 'Close' : 'Collapse panel'}
                  style={{
                    width: '22px', height: '22px', borderRadius: '6px',
                    background: 'var(--bg-3)', border: '1px solid var(--border)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}
                >
                  {isOverlay
                    ? <X size={12} style={{ color: 'var(--text-3)' }} />
                    : <ChevronRight size={12} style={{ color: 'var(--text-3)' }} />}
                </button>
              </div>
            </>
          )}

          {!open && (
            <button
              onClick={onToggle}
              title={`References${paperSources.length > 0 ? ` (${paperSources.length})` : ''}`}
              style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: paperSources.length > 0 ? 'var(--accent-dim)' : 'var(--bg-3)',
                border: `1px solid ${paperSources.length > 0 ? 'rgba(200,245,62,0.2)' : 'var(--border)'}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexDirection: 'column', gap: '2px',
              }}
            >
              <ChevronLeft size={12} style={{ color: paperSources.length > 0 ? 'var(--accent)' : 'var(--text-3)' }} />
              {paperSources.length > 0 && (
                <span style={{ fontSize: '8px', fontWeight: 800, color: 'var(--accent)', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
                  {paperSources.length}
                </span>
              )}
            </button>
          )}
        </div>

        {open && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {paperSources.length === 0 ? (
              <EmptyState isLoading={isLoading} />
            ) : (
              <AnimatePresence>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {paperSources.map((source, idx) => (
                    <SourceCard key={`${source.source}-${idx}`} source={source} index={idx} />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}
