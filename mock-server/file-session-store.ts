import { Store } from 'express-session';
import { sessionManager } from './session-manager';

export class FileSessionStore extends Store {
  constructor() {
    super();
  }

  get(
    sessionId: string,
    callback: (
      err: unknown,
      session?: import('express-session').SessionData | null
    ) => void
  ): void {
    try {
      const user = sessionManager.getSession(sessionId);

      if (user) {
        const session = {
          user,
          cookie: {
            originalMaxAge: 24 * 60 * 60 * 1000, // 24 hours
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            secure: false,
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
          },
        };
        callback(null, session);
      } else {
        callback(null, null);
      }
    } catch (error) {
      callback(error);
    }
  }

  set(
    sessionId: string,
    session: import('express-session').SessionData,
    callback?: (err?: unknown) => void
  ): void {
    try {
      if (session.user) {
        sessionManager.updateSession(sessionId, session.user);
      }
      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }

  destroy(sessionId: string, callback?: (err?: unknown) => void): void {
    try {
      sessionManager.destroySession(sessionId);
      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }

  length(callback: (err: unknown, length?: number) => void): void {
    try {
      const count = sessionManager.getActiveSessionCount();
      callback(null, count);
    } catch (error) {
      callback(error);
    }
  }

  clear(callback?: (err?: unknown) => void): void {
    try {
      const sessions = sessionManager.getAllActiveSessions();
      for (const sessionId of Object.keys(sessions)) {
        sessionManager.destroySession(sessionId);
      }
      callback?.();
    } catch (error) {
      callback?.(error);
    }
  }

  touch(
    _sessionId: string,
    _session: import('express-session').SessionData,
    callback?: () => void
  ): void {
    // For file-based sessions, we don't need to implement touch
    // as our sessions have fixed expiration times
    callback?.();
  }
}
