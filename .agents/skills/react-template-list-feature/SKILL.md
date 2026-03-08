---
name: react-template-list-feature
description: 'Create or refactor a React template list page feature using this repo pattern: feature folder with <feature>.page.tsx and <feature>.handler.ts, TanStack Query data loading, centralized data-access api.ts, DataTable and Pagination from common/ui, route wiring in common/router.tsx, and i18n locale keys in en/el.'
argument-hint: 'Feature name, API endpoint, row shape, filters, and route path'
---

# React Template List Feature

## What This Skill Produces

A complete list feature that follows this repository architecture:

- `src/features/<feature>/<feature>.page.tsx`: UI rendering and wiring only
- `src/features/<feature>/<feature>.handler.ts`: query state, table state, filter logic, pagination handlers
- `src/data-access/api.ts`: API function for the list endpoint
- `src/data-access/api.schema.ts`: response schema/parser updates
- `src/common/router.tsx`: lazy route registration via `withSuspense(...)`
- `public/locales/en/<namespace>.json` and `public/locales/el/<namespace>.json`: user-facing strings

## When To Use

Use this skill when asked to:

- Add a new list page in this React template
- Refactor an existing list page to match project conventions
- Add filters/sorting/pagination to a server-driven table
- Move direct API calls out of features into `data-access`

## Required Inputs

Collect or infer these before coding:

- Feature folder/path and route path (example: `team-members`, `/team-members`)
- API endpoint and query params (example: `page`, `limit`, optional filter params)
- Row shape and column definitions
- Server pagination contract (`page`, `limit`, `total`, `totalPages`)
- Translation namespace and key names

If critical details are missing, ask concise questions before implementation.

## Workflow

1. Understand Existing Pattern

- Inspect a similar feature (default reference: `src/features/team-members`).
- Keep UI/logic split strict: no business logic in `<feature>.page.tsx`.
- Keep API access centralized: no `httpClient` calls in feature files.

2. Define Data Contract in Data Access

- Add/update parsing schema in `src/data-access/api.schema.ts`.
- Add/update API function in `src/data-access/api.ts`.
- Return parsed/validated data from data-access functions.

3. Build Handler (`<feature>.handler.ts`)

- Add `useQuery` with stable `queryKey` and `queryFn` from `~/data-access/api`.
- Model local view state in handler: sorting, search text, filters, page.
- Keep table columns in handler (`useMemo`) with translated headers.
- Expose derived rows, filter options, loading state, and pagination model.

4. Build UI (`<feature>.page.tsx`)

- Use `useTranslation(<namespace>)` for all user-facing labels.
- Render filters/search/table/pagination with reusable components from `~/common/ui`.
- Wire component props only; no async or domain logic in the UI layer.
- If nested flow exists (example create form), keep `<Outlet />` where required.

5. Wire Route

- Add lazy import in `src/common/router.tsx`.
- Register route under the correct parent layout/guard.
- Use `withSuspense(Component, key)` and preserve route nesting conventions.

6. Add Translations

- Add or update keys in both:
  - `public/locales/en/<namespace>.json`
  - `public/locales/el/<namespace>.json`
- Ensure keys used in UI exist in both locales.
- Prefer namespace-specific keys; use `common:` only for truly shared strings.

7. Verify

- Run `pnpm type-check`.
- Run `pnpm build` for route/UI-affecting changes.
- If list behavior changed significantly, confirm table render, filtering, and pagination manually.

## Decision Points

- Server-side vs client-side filtering:
  - If API supports filters, send filters to API and keep handler derivation minimal.
  - If API does not support filters, perform deterministic client-side filtering in handler.

- Route placement:
  - Authenticated app pages go under `PrivateRoute` + `AppLayout`.
  - Public/auth pages stay under `PublicRoute` + `AuthLayout`.

- Feature complexity:
  - Simple list: keep only `<feature>.page.tsx` + `<feature>.handler.ts`.
  - Growing feature: split table config or filter utilities, but keep folder-local organization.

## Completion Checklist

- Data access function exists in `src/data-access/api.ts` and parses via schema.
- No direct API calls from feature files.
- `<feature>.page.tsx` contains rendering/wiring only.
- `<feature>.handler.ts` contains state, query, derived data, and handlers.
- Route is lazy-loaded and nested correctly.
- Locale keys exist in both `en` and `el` files.
- `pnpm type-check` passes.
- `pnpm build` passes when route/UI was changed.
