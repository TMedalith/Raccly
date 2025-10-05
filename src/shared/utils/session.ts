
export function generateSessionId(): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `session-${timestamp}-${randomStr}`;
}

export function getSessionId(): string {
  return generateSessionId();
}

export function getConversationSessionId(conversationId?: string): string {
  if (conversationId) {
        return `conv-${conversationId}`;
  }
  return generateSessionId();
}
