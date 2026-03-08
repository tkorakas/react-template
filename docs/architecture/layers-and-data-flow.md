# Layers and Data Flow

## Routing and layout composition

Routes are defined in `src/common/router.tsx` and composed as:

- Private app: `PrivateRoute` -> `AppLayout` -> app pages.
- Public auth: `PublicRoute` -> `AuthLayout` -> auth pages.
- OAuth callback route is handled as a dedicated page route.

## Data access boundary

All endpoint calls are centralized in feature folders under `src/data-access/<feature>/<feature>.api.ts`.

`src/data-access/<feature>/<feature>.schema.ts` contains response parsers and schema contracts.

This keeps feature code focused on orchestration:

1. Handler calls API function from feature-specific modules (for example `~/data-access/auth/auth.api`).
2. API function executes request with `httpClient`.
3. Response is parsed by Zod before returning.
4. Handler updates UI state or triggers side effects.

## Query and session flow

The auth session uses `useAuth` with query key `['user']` and infinite stale/cache time.

Team members list uses query key `['team-members', page]` and combines server pagination with client-side filter state.

## i18n boundary

User-facing strings and validation messages belong in locale namespaces under `public/locales/en` and `public/locales/el`.
