# Available Skills

The repository currently includes three specialized skills under `.agents/skills`.

## `react-template-form-feature`

Use when creating or refactoring form-driven features.

Focus:

- `*.schema.ts` + `*.handler.ts` + `*.page.tsx` pattern.
- RHF + Zod wiring and shared form field usage.
- Mutation flow and post-submit behavior.
- Locale sync for user-facing labels and validation messages.

## `react-template-table-feature`

Use when creating or refactoring table-driven pages.

Focus:

- Table handler/page split.
- Query + URL-synced state + filtering orchestration.
- `DataTable` and `Pagination` integration.
- `useTableState`, `FiltersPanel`, and `TableChipFilter` integration.
- Route wiring and locale sync.

## `react-template-data-access-endpoint`

Use when adding or updating endpoint integration.

Focus:

- Add contracts in feature-scoped `<feature>.schema.ts` files.
- Add API functions in feature-scoped `<feature>.api.ts` files.
- Keep feature code free of direct `httpClient` usage.
- Sync Mockoon endpoints and payload shapes.

## Selection guide

- New/updated form workflow: choose `react-template-form-feature`.
- New table page workflow: choose `react-template-table-feature`.
- API contract or endpoint changes: choose `react-template-data-access-endpoint`.
