export function generateSessionId(): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `session-${timestamp}-${randomStr}`;
}
