import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import type { SessionUser } from './user-schemas';

interface SessionData {
  user?: SessionUser;
  createdAt: number;
  expiresAt: number;
}

interface SessionStore {
  [sessionId: string]: SessionData;
}

export class SessionManager {
  private filePath: string;
  private sessions: SessionStore = {};
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  constructor(filePath: string = './mock-server/data/sessions.json') {
    this.filePath = join(process.cwd(), filePath);
    this.ensureDirectoryExists();
    this.loadSessions();
    this.startCleanupInterval();
  }

  private ensureDirectoryExists(): void {
    const dir = dirname(this.filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  private loadSessions(): void {
    try {
      if (existsSync(this.filePath)) {
        const data = readFileSync(this.filePath, 'utf8');
        this.sessions = JSON.parse(data);
        // Clean up expired sessions on load
        this.cleanupExpiredSessions();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading sessions:', error);
      this.sessions = {};
    }
  }

  private saveSessions(): void {
    try {
      writeFileSync(
        this.filePath,
        JSON.stringify(this.sessions, null, 2),
        'utf8'
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving sessions:', error);
    }
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    let hasChanges = false;

    for (const [sessionId, session] of Object.entries(this.sessions)) {
      if (session.expiresAt < now) {
        delete this.sessions[sessionId];
        hasChanges = true;
      }
    }

    if (hasChanges) {
      this.saveSessions();
    }
  }

  private startCleanupInterval(): void {
    // Clean up expired sessions every hour
    setInterval(
      () => {
        this.cleanupExpiredSessions();
      },
      60 * 60 * 1000
    );
  }

  generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  createSession(sessionId: string, user: SessionUser): void {
    const now = Date.now();
    this.sessions[sessionId] = {
      user,
      createdAt: now,
      expiresAt: now + this.SESSION_DURATION,
    };
    this.saveSessions();
  }

  getSession(sessionId: string): SessionUser | null {
    const session = this.sessions[sessionId];

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      this.destroySession(sessionId);
      return null;
    }

    return session.user || null;
  }

  updateSession(sessionId: string, user: SessionUser): void {
    const session = this.sessions[sessionId];

    if (!session || session.expiresAt < Date.now()) {
      // Create new session if it doesn't exist or is expired
      this.createSession(sessionId, user);
      return;
    }

    session.user = user;
    this.saveSessions();
  }

  destroySession(sessionId: string): void {
    if (this.sessions[sessionId]) {
      delete this.sessions[sessionId];
      this.saveSessions();
    }
  }

  getAllActiveSessions(): SessionStore {
    this.cleanupExpiredSessions();
    return { ...this.sessions };
  }

  getActiveSessionCount(): number {
    this.cleanupExpiredSessions();
    return Object.keys(this.sessions).length;
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
