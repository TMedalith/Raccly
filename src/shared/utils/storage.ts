/**
 * LocalStorage utilities for persisting chat state
 */

import type { Message } from '@/features/chat/types';

const MESSAGES_STORAGE_KEY = 'memoralab_messages';

/**
 * Saves messages to localStorage
 */
export function saveMessages(sessionId: string, messages: Message[]): void {
  if (typeof window === 'undefined') return;

  try {
    const allMessages = getAllStoredMessages();
    allMessages[sessionId] = messages;
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('conversationsUpdated'));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

/**
 * Retrieves messages from localStorage for a specific session
 */
export function loadMessages(sessionId: string): Message[] {
  if (typeof window === 'undefined') return [];

  try {
    const allMessages = getAllStoredMessages();
    const messages = allMessages[sessionId] || [];

    // Convert timestamp strings back to Date objects
    return messages.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
}

/**
 * Gets all stored messages for all sessions
 */
function getAllStoredMessages(): Record<string, Message[]> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error parsing stored messages:', error);
    return {};
  }
}

/**
 * Clears messages for a specific session
 */
export function clearSessionMessages(sessionId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const allMessages = getAllStoredMessages();
    delete allMessages[sessionId];
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));
  } catch (error) {
    console.error('Error clearing messages:', error);
  }
}

/**
 * Clears all stored messages
 */
export function clearAllMessages(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing all messages:', error);
  }
}

/**
 * Gets all conversation sessions with their metadata
 */
export function getAllConversations(): Array<{
  sessionId: string;
  title: string;
  lastMessage: Date;
  messageCount: number;
}> {
  if (typeof window === 'undefined') return [];

  try {
    const allMessages = getAllStoredMessages();
    return Object.entries(allMessages)
      .filter(([, messages]) => messages.length > 0)
      .map(([sessionId, messages]) => {
        const lastMsg = messages[messages.length - 1];
        const firstUserMsg = messages.find(m => m.role === 'user');
        return {
          sessionId,
          title: firstUserMsg?.content.slice(0, 50) || 'Nueva conversación',
          lastMessage: new Date(lastMsg.timestamp),
          messageCount: messages.length,
        };
      })
      .sort((a, b) => b.lastMessage.getTime() - a.lastMessage.getTime());
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
}
