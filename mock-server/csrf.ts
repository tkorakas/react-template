import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'x-csrf-token';

declare module 'express-session' {
  interface SessionData {
    csrfToken?: string;
  }
}

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function setCsrfCookie(res: Response, token: string): void {
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });
}

const CSRF_EXEMPT_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/mfa/verify',
  '/auth/oauth',
];

export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  console.log('CSRF Protection Middleware Invoked', req.path);

  if (CSRF_EXEMPT_PATHS.some(path => req.path.startsWith(path))) {
    return next();
  }

  const sessionToken = req.session?.csrfToken;
  const headerToken = req.headers[CSRF_HEADER_NAME] as string | undefined;

  if (!sessionToken || !headerToken) {
    res.status(403).json({
      error: 'CSRF token missing',
      message: 'Request must include CSRF token in header',
    });
    return;
  }

  if (sessionToken !== headerToken) {
    res.status(403).json({
      error: 'CSRF token mismatch',
      message: 'CSRF token in header does not match session token',
    });
    return;
  }

  next();
}

export function ensureCsrfToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.session?.csrfToken) {
    const token = generateCsrfToken();
    req.session.csrfToken = token;
    setCsrfCookie(res, token);
  } else if (!req.cookies[CSRF_COOKIE_NAME]) {
    setCsrfCookie(res, req.session.csrfToken);
  }
  next();
}
