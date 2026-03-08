---
name: react-template-table-feature
description: 'Create or refactor a React template table feature with this repo pattern: <feature>.page.tsx + <feature>.handler.ts + optional <feature>.column.ts, URL-synced state via useTableState, DataTable/Pagination and table helpers from common/ui, centralized data-access, route wiring in common/router.tsx, and locale sync in en/el.'
argument-hint: 'Feature name, API endpoint, row shape, filters, and route path'
---

# React Template Table Feature

## What This Skill Produces

A complete table feature that follows this repository architecture:

- `src/features/<feature>/<feature>.page.tsx`: UI rendering and wiring only
- `src/features/<feature>/<feature>.handler.ts`: query state, table state, filter logic, pagination handlers
- `src/features/<feature>/<feature>.column.ts` (recommended): table column definitions
- `src/data-access/<feature>/<feature>.api.ts`: API function for the table endpoint
- `src/data-access/<feature>/<feature>.schema.ts`: response schema/parser updates
- `src/common/router.tsx`: lazy route registration via `withSuspense(...)`
- `public/locales/en/<namespace>.json` and `public/locales/el/<namespace>.json`: user-facing strings

## When To Use

Use this skill when asked to:

- Add a new table page in this React template
- Refactor an existing table page to match project conventions
- Add URL-synced filters/sorting/pagination to a server-driven table
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

- Add/update parsing schema in `src/data-access/<feature>/<feature>.schema.ts`.
- Add/update API function in `src/data-access/<feature>/<feature>.api.ts`.
- Return parsed/validated data from data-access functions.

3. Build Handler (`<feature>.handler.ts`)

- Add `useQuery` with stable `queryKey` and `queryFn` from feature-specific data-access modules.
- Model table view state with `useTableState`: `filters`, `page`, `limit`, `sorting`, and optional row selection.
- Keep filtering deterministic (server-driven when supported, otherwise client-side derived rows).
- Expose derived rows, filter options, loading state, and pagination model.

4. Define Columns (`<feature>.column.ts`)

- Prefer a dedicated columns file with a `use<Feature>Columns` hook.
- Keep translated headers and cell rendering details in columns file.
- Keep handler focused on data and state orchestration.

5. Build UI (`<feature>.page.tsx`)

- Use `useTranslation(<namespace>)` for all user-facing labels.
- Render filters/search/table/pagination with reusable components from `~/common/ui`.
- Prefer table helpers where applicable: `FiltersPanel`, `TableChipFilter`, `TableActionBar`, `DateRangeSelector`.
- Wire component props only; no async or domain logic in the UI layer.
- If nested flow exists (example create form), keep `<Outlet />` where required.

6. Wire Route

- Add lazy import in `src/common/router.tsx`.
- Register route under the correct parent layout/guard.
- Use `withSuspense(Component, key)` and preserve route nesting conventions.

7. Add Translations

- Add or update keys in both:
  - `public/locales/en/<namespace>.json`
  - `public/locales/el/<namespace>.json`
- Ensure keys used in UI exist in both locales.
- Prefer namespace-specific keys; use `common:` only for truly shared strings.

8. Verify

- Run `pnpm type-check`.
- Run `pnpm build` for route/UI-affecting changes.
- If table behavior changed significantly, confirm table render, filtering, and pagination manually.

## Decision Points

- Server-side vs client-side filtering:
  - If API supports filters, send filters to API and keep handler derivation minimal.
  - If API does not support filters, perform deterministic client-side filtering in handler.

- Route placement:
  - Authenticated app pages go under `PrivateRoute` + `AppLayout`.
  - Public/auth pages stay under `PublicRoute` + `AuthLayout`.

- Feature complexity:
  - Simple table: keep `<feature>.page.tsx` + `<feature>.handler.ts`.
  - Growing table: add `<feature>.column.ts` and folder-local filter utilities.

## Completion Checklist

- Data access function exists in `src/data-access/<feature>/<feature>.api.ts` and parses via schema.
- No direct API calls from feature files.
- `<feature>.page.tsx` contains rendering/wiring only.
- `<feature>.handler.ts` contains state, query, derived data, and handlers.
- `useTableState` is used for URL-synced table state when table behavior is present.
- Column config is split to `<feature>.column.ts` when table grows beyond trivial setup.
- Route is lazy-loaded and nested correctly.
- Locale keys exist in both `en` and `el` files.
- `pnpm type-check` passes.
- `pnpm build` passes when route/UI was changed.
