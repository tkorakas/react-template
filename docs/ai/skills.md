# Available Skills

The repository currently includes three specialized skills under `.agents/skills`.

## `react-template-form-feature`

Use when creating or refactoring form-driven features.

Focus:

- `*.schema.ts` + `*.handler.ts` + `*.page.tsx` pattern.
- RHF + Zod wiring and shared form field usage.
- Mutation flow and post-submit behavior.
- Locale sync for user-facing labels and validation messages.

## `react-template-list-feature`

Use when creating or refactoring list/table pages.

Focus:

- List handler/page split.
- Query + pagination + filtering orchestration.
- `DataTable` and `Pagination` integration.
- Route wiring and locale sync.

## `react-template-data-access-endpoint`

Use when adding or updating endpoint integration.

Focus:

- Add contracts in `api.schema.ts`.
- Add API functions in `api.ts`.
- Keep feature code free of direct `httpClient` usage.
- Sync Mockoon endpoints and payload shapes.

## Selection guide

- New/updated form workflow: choose `react-template-form-feature`.
- New list page with table behavior: choose `react-template-list-feature`.
- API contract or endpoint changes: choose `react-template-data-access-endpoint`.
