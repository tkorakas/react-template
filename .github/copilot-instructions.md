# Copilot Instructions

## Tech Stack

React 19, TypeScript strict, TanStack Query v5, React Hook Form + Zod, Chakra UI v3, React Router v7, Ky HTTP client, i18next

## Project Structure

```
src/
├── common/
│   ├── auth/        # Authentication manager, guards, auth hooks
│   ├── ui/          # Shared reusable UI components (layout, form, table, feedback)
│   ├── router.tsx   # Route configuration
│   ├── system.ts    # Chakra system config
│   ├── i18n.ts      # i18n setup and namespaces
│   ├── query-client.ts
│   └── http-client.ts
├── data-access/
│   ├── api.ts       # API functions (public)
│   └── api.schema.ts # INTERNAL parsing/validation schemas
├── features/        # Route features and subfeatures
│   ├── home-page.tsx
│   ├── login/
│   ├── register/
│   ├── mfa/
│   ├── oauth/
│   └── team-members/
└── main.tsx

public/
└── locales/{en,el}/*.json  # i18n namespaces

mocks/
└── api.mockoon.json         # Mockoon environment for API simulation
```

## Feature Pattern

For feature folders (for example `login`, `register`, `mfa`, `team-members/create`):

```
features/{feature}/
├── index.tsx       # UI layer
├── use-handler.ts  # Logic layer
└── schema.ts       # Zod form schema
```

For single-page features at root level, use `*-page.tsx` (for example `home-page.tsx`).

## File Naming

- Use kebab-case for all files
- Keep existing conventions:
  - `index.tsx` for folder entry pages/components
  - `use-handler.ts` for feature logic
  - `schema.ts` for feature validation schemas
  - `*-page.tsx` for standalone route pages

## Imports

```tsx
import { getTeamMembers } from '~/data-access/api';
import { DataTable, Pagination, Loading } from '~/common/ui';
import { useAuth } from '~/common/auth';
import { httpClient } from '~/common/http-client';
```

Rules:

- Use `~/` alias imports
- Import API functions from `~/data-access/api`
- Do not import from deep UI internals when `~/common/ui` exports what you need

## Data Access Rules

- Keep API calls centralized in `src/data-access/api.ts`
- Keep Zod schemas/parsers internal in `src/data-access/api.schema.ts`
- Parse API responses in data-access before returning to features
- Do not make direct API calls from feature components/handlers

## UI + Handler Separation

- `index.tsx`: rendering and wiring only
- `use-handler.ts`: state, queries, mutations, navigation, submit handlers
- Keep business logic out of UI files

## Forms

- Use React Hook Form + Zod resolver
- Use UI form components from `~/common/ui` (`TextInput`, `Radio`, `SimpleForm`, etc.)
- Always wire fields with `form.register(...)` and pass field errors

## Table/List Pattern

- Use `DataTable` and `Pagination` from `~/common/ui`
- Keep table column definitions in handler (or split if a feature grows)
- Server pagination comes from API (`page`, `limit`, `total`, `totalPages`)
- Do not implement client-side pagination for server-driven lists

## Routing Rules

- Configure routes in `src/common/router.tsx`
- Private app routes are nested under `PrivateRoute` + `AppLayout`
- Public auth routes are nested under `PublicRoute` + `AuthLayout`
- Keep route pages lazy-loaded via `withSuspense(...)`

## i18n Rules

- Do not hardcode user-facing strings in feature UIs unless explicitly requested
- Add/update translation keys under `public/locales/en` and `public/locales/el`
- Use `useTranslation()` and feature namespaces (`team-members`, `login`, etc.)

## Mock API Rules

- Update `mocks/api.mockoon.json` when data-access endpoints change
- Keep endpoint paths aligned with `httpClient` prefix `/api`
- Keep response shapes aligned with parsers in `api.schema.ts`

## Verification

After making changes, run relevant checks before handoff:

- `pnpm type-check`
- `pnpm build` for route/UI/build-affecting work

## Do / Don't

**Do:**

- Keep UI and logic separated
- Keep API access centralized in `data-access`
- Use reusable UI from `~/common/ui`
- Follow existing naming and structure patterns
- Keep locale files in sync when changing navigation or labels

**Don't:**

- Add comments in code unless necessary
- Introduce new architectural patterns that conflict with current structure
- Reintroduce removed routes/pages (for example About) unless requested
- Leave stale translation keys or unused pages after structural changes

Reference docs:

- Zod: https://zod.dev/llms.txt
- Chakra UI: https://chakra-ui.com/llms.txt
