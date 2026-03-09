# Auth Deep Dive

This page explains how auth works end-to-end in this template, including cookie behavior, route guards, cache lifecycle, and backend customization points.

## Architecture at a glance

Auth logic is split across three layers:

- `src/common/auth`: auth state, guards, and HTTP hooks.
- `src/data-access/auth`: endpoint functions and schema parsing.
- `src/features/{login,register,mfa,oauth}`: UI + handler orchestration.

This keeps UI rendering separate from transport details and contract parsing.

## Session and cookie model

The template is configured for cookie-based sessions:

- `src/common/http-client.ts` sets `credentials: 'include'` so browser cookies are sent on API requests.
- `src/common/auth/auth-hooks.ts` adds CSRF protection by reading `XSRF-TOKEN` cookie and sending it as `X-CSRF-TOKEN` for non-safe methods.
- Auth state is kept in TanStack Query (`['user']`) rather than local storage.

Practical result:

- Session persistence is owned by backend cookies.
- Frontend cache mirrors authenticated user data for route decisions and UI.

## App boot and auth restoration

At app start:

1. `useAuth()` in `src/common/auth/use-auth.ts` runs `getCurrentUser()` (`GET /api/auth/me`).
2. Query uses `gcTime: Infinity` and `staleTime: Infinity` for stable session state.
3. Guards use `isAuthenticated` to allow or block routes.

If backend returns `401` for non-`/auth/me` requests, `beforeError` hook in `src/common/auth/auth-hooks.ts` clears the user query cache.

## Route guards and flow control

Routing is defined in `src/common/router.tsx`:

- `PrivateRoute` protects app pages and redirects unauthenticated users to `/login`.
- `PublicRoute` protects auth pages and redirects authenticated users to `/`.
- OAuth callback route (`/oauth/:provider/callback`) is outside `AuthLayout` but still under `PublicRoute` so provider redirects can complete.

Guard implementations:

- `src/common/auth/private-route.tsx`
- `src/common/auth/public-route.tsx`

## Login/Register/MFA/OAuth lifecycle

### Login

- Handler: `src/features/login/login.handler.ts`
- API: `login()` in `src/data-access/auth/auth.api.ts`
- Success path: `setUser(user)` then navigate to prior target route.
- MFA path: `409` is mapped to `MfaRequiredError` and redirects to `/mfa`.

### Register

- Handler: `src/features/register/register.handler.ts`
- API: `register()`
- Success path: invalidates `['user']` query and navigates to `/`.

### MFA

- Handler: `src/features/mfa/mfa.handler.ts`
- API: `verifyMfa()`
- Success path: invalidates `['user']` query and navigates to `/`.

### OAuth callback

- Handler: `src/features/oauth/oauth-callback.handler.ts`
- API: `oauthCallback(provider, code)`
- Success path: `setUser(user)`.

## Data contracts and parsing

All auth responses are parsed in `src/data-access/auth/auth.schema.ts` using Zod:

- `authUserResponseSchema`
- `authCurrentUserResponseSchema`
- `authErrorResponseSchema`

Endpoint functions in `src/data-access/auth/auth.api.ts` parse responses before returning data to features.

## Backend customization guide

Use these extension points when your backend differs.

### 1. Different endpoint paths

Edit `src/data-access/auth/auth.api.ts`:

- `auth/login`
- `auth/register`
- `auth/verify-mfa`
- `auth/me`
- `auth/logout`
- `auth/oauth/:provider/*`

### 2. Different base URL or proxy

- `src/common/http-client.ts`: change `prefixUrl`.
- `vite.config.ts`: align `/api` dev proxy target.

### 3. Different response payloads

Edit `src/data-access/auth/auth.schema.ts` and keep parser changes in sync with backend contract.

If backend returns wrapped payloads (example `{ user: {...} }`), adjust `auth.api.ts` extraction before schema parse.

### 4. Different MFA signaling

Current login treats `409` as MFA required. If backend uses a different status/body, update error mapping in `login()`.

### 5. Different CSRF/cookie strategy

Edit `src/common/auth/auth-hooks.ts`:

- Cookie name (`XSRF-TOKEN`)
- Header name (`X-CSRF-TOKEN`)
- Conditions for injection

If backend uses bearer tokens instead of cookies, adjust `beforeRequest` logic and state handling accordingly.

## Common pitfalls

- Schema drift: backend response changes without schema updates causes parse failures.
- Proxy mismatch: wrong `/api` target leads to auth failures in local dev.
- Inconsistent MFA handling: wrong status/body mapping keeps users on login.
- Stale assumptions after auth changes: always trigger `setUser` or `invalidateQueries` on successful auth transitions.

## Recommended verification

1. `pnpm run type-check`
2. `pnpm run build`
3. Manual login/register/logout/MFA/OAuth flow test against real backend or Mockoon
4. Browser devtools check for cookie and CSRF header behavior
