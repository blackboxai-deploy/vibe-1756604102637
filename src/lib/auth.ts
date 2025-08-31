import { loadConfig } from './storage';

export async function validateAdminCredentials(username: string, password: string): Promise<boolean> {
  const config = await loadConfig();
  return (
    config.adminCredentials.username === username &&
    config.adminCredentials.password === password
  );
}

export function generateSessionToken(): string {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

// Simple in-memory session store (for demo purposes)
// In production, use Redis or database
const sessions = new Map<string, { userId: string; createdAt: number }>();

export function createSession(userId: string): string {
  const token = generateSessionToken();
  sessions.set(token, {
    userId,
    createdAt: Date.now()
  });
  return token;
}

export function validateSession(token: string): boolean {
  const session = sessions.get(token);
  if (!session) return false;

  // Session expires after 24 hours
  const sessionAge = Date.now() - session.createdAt;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  if (sessionAge > maxAge) {
    sessions.delete(token);
    return false;
  }

  return true;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}

export function cleanExpiredSessions(): void {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  for (const [token, session] of sessions.entries()) {
    if (now - session.createdAt > maxAge) {
      sessions.delete(token);
    }
  }
}