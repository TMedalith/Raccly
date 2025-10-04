/**
 * Session management utilities for chat
 */

/**
 * Generates a unique session ID
 */
export function generateSessionId(): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `session-${timestamp}-${randomStr}`;
}

/**
 * Gets a new session ID (always creates a fresh one)
 */
export function getSessionId(): string {
  return generateSessionId();
}

/**
 * Gets or creates session ID for a specific conversation
 */
export function getConversationSessionId(conversationId?: string): string {
  if (conversationId) {
    // Use conversation ID as session ID for consistency
    return `conv-${conversationId}`;
  }
  return generateSessionId();
}
