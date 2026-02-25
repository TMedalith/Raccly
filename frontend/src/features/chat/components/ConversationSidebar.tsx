'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PanelLeftClose, SquarePen, Trash2, Search, MessageSquare, X } from 'lucide-react';
import { loadConversationMetas, deleteConversation } from '@/shared/utils/storage';
import { generateSessionId } from '@/shared/utils/session';
import type { ConversationMeta } from '../types';

interface ConversationSidebarProps {
  currentId: string;
  isOverlay?: boolean;
  onClose?: () => void;
  onCollapse?: () => void;
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  const hr = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day === 1) return 'Yesterday';
  return `${day}d ago`;
}

function groupByDate(convs: ConversationMeta[]): { label: string; items: ConversationMeta[] }[] {
  const now = Date.now();
  const today: ConversationMeta[] = [];
  const yesterday: ConversationMeta[] = [];
  const earlier: ConversationMeta[] = [];

  for (const c of convs) {
    const diff = now - c.updatedAt;
    if (diff < 86400000) today.push(c);
    else if (diff < 172800000) yesterday.push(c);
    else earlier.push(c);
  }

  const groups = [];
  if (today.length) groups.push({ label: 'Today', items: today });
  if (yesterday.length) groups.push({ label: 'Yesterday', items: yesterday });
  if (earlier.length) groups.push({ label: 'Earlier', items: earlier });
  return groups;
}

export function ConversationSidebar({ currentId, isOverlay, onClose, onCollapse }: ConversationSidebarProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const reload = () => setConversations(loadConversationMetas());

  useEffect(() => {
    reload();
    window.addEventListener('conversationsUpdated', reload);
    return () => window.removeEventListener('conversationsUpdated', reload);
  }, []);

  const filtered = search.trim()
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.firstMessage.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  const groups = groupByDate(filtered);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteConversation(id);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';
      await fetch(`${base}/session/${id}`, { method: 'DELETE' });
    } catch { /* ignored */ }
    if (id === currentId) router.push('/chat');
  };

  return (
    <div
      style={{
        width: '260px',
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-2)',
        borderRight: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 16px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '-0.03em',
            color: 'var(--text)',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>R</span>accly
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {isOverlay && (
            <button
              onClick={onClose}
              title="Close"
              style={{
                width: '26px', height: '26px', borderRadius: '7px',
                background: 'var(--bg-3)', border: '1px solid var(--border)',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0, transition: 'opacity 0.15s',
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.7')}
              onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
            >
              <X size={12} style={{ color: 'var(--text-3)' }} />
            </button>
          )}
          {!isOverlay && onCollapse && (
            <button
              onClick={onCollapse}
              title="Collapse sidebar"
              style={{
                width: '26px', height: '26px', borderRadius: '7px',
                background: 'var(--bg-3)', border: '1px solid var(--border)',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0, transition: 'opacity 0.15s',
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.7')}
              onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
            >
              <PanelLeftClose size={13} style={{ color: 'var(--text-3)' }} />
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '10px 12px 0', flexShrink: 0 }}>
        <button
          onClick={() => { router.push(`/chat/${generateSessionId()}`); onClose?.(); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 12px',
            background: 'var(--accent-dim)',
            border: '1px solid rgba(200,245,62,0.18)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '12px', fontWeight: 600, color: 'var(--accent)',
            fontFamily: 'var(--font-body)', transition: 'all 0.15s',
          }}
          onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,245,62,0.14)'; }}
          onMouseOut={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-dim)'; }}
        >
          <SquarePen size={13} />
          New conversation
        </button>
      </div>

      <div style={{ padding: '10px 12px', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 10px',
            background: 'var(--bg-3)',
            border: '1px solid var(--border)',
            borderRadius: '9px',
          }}
        >
          <Search size={12} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '12px',
              color: 'var(--text)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 12px' }}>
        {conversations.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '32px 16px',
              color: 'var(--text-3)',
              textAlign: 'center',
            }}
          >
            <MessageSquare size={20} style={{ opacity: 0.4 }} />
            <p style={{ fontSize: '12px', lineHeight: 1.5 }}>
              No conversations yet.
              <br />
              Start by asking a question.
            </p>
          </div>
        ) : groups.length === 0 ? (
          <p style={{ fontSize: '12px', color: 'var(--text-3)', padding: '16px', textAlign: 'center' }}>
            No results
          </p>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <p
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--text-3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '10px 8px 4px',
                }}
              >
                {group.label}
              </p>
              {group.items.map((conv) => {
                const isActive = conv.id === currentId;
                const isHovered = hoveredId === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => { router.push(`/chat/${conv.id}`); onClose?.(); }}
                    onMouseEnter={() => setHoveredId(conv.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '9px',
                      cursor: 'pointer',
                      background: isActive
                        ? 'rgba(200,245,62,0.07)'
                        : isHovered
                        ? 'var(--bg-3)'
                        : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(200,245,62,0.18)' : 'transparent'}`,
                      transition: 'all 0.12s',
                      marginBottom: '2px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: '12px',
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? 'var(--text)' : 'var(--text-2)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: 1.4,
                          marginBottom: '1px',
                        }}
                      >
                        {conv.title}
                      </p>
                      <p style={{ fontSize: '10px', color: 'var(--text-3)', lineHeight: 1.3 }}>
                        {relativeTime(conv.updatedAt)}
                      </p>
                    </div>

                    {isHovered && (
                      <button
                        onClick={(e) => handleDelete(e, conv.id)}
                        title="Delete"
                        style={{
                          flexShrink: 0,
                          width: '22px',
                          height: '22px',
                          borderRadius: '5px',
                          background: 'var(--bg-4)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.1s',
                        }}
                        onMouseOver={(e) => {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.background = 'rgba(255,80,80,0.15)';
                          el.style.borderColor = 'rgba(255,80,80,0.3)';
                        }}
                        onMouseOut={(e) => {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.background = 'var(--bg-4)';
                          el.style.borderColor = 'var(--border)';
                        }}
                      >
                        <Trash2 size={11} style={{ color: 'var(--text-3)' }} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
