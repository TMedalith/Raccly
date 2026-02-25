import type { Message, ConversationMeta } from '@/features/chat/types';

const MESSAGES_KEY = 'raccly_messages';
const CONVERSATIONS_KEY = 'raccly_conversations';

function getAllMessages(): Record<string, Message[]> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

export function saveMessages(sessionId: string, messages: Message[]): void {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllMessages();
    all[sessionId] = messages;
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('conversationsUpdated'));
  } catch (e) {
    console.error('Error saving messages:', e);
  }
}

export function loadMessages(sessionId: string): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    return (getAllMessages()[sessionId] || []).map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch { return []; }
}

export function saveConversationMeta(meta: ConversationMeta): void {
  if (typeof window === 'undefined') return;
  const all = loadConversationMetas();
  const idx = all.findIndex((c) => c.id === meta.id);
  if (idx >= 0) all[idx] = meta;
  else all.unshift(meta);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event('conversationsUpdated'));
}

export function loadConversationMetas(): ConversationMeta[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export function deleteConversation(id: string): void {
  if (typeof window === 'undefined') return;
  const metas = loadConversationMetas().filter((c) => c.id !== id);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(metas));
  const msgs = getAllMessages();
  delete msgs[id];
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
  window.dispatchEvent(new Event('conversationsUpdated'));
}
