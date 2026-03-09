# Available Skills

The repository currently includes three specialized skills under `.agents/skills`.

Use these together with `AGENTS.md` so generated code follows this project's architectural rules.

## `react-template-form-feature`

Use when creating or refactoring form-driven features.

Focus:

- `*.schema.ts` + `*.handler.ts` + `*.page.tsx` pattern.
- RHF + Zod wiring and shared form field usage.
- Mutation flow and post-submit behavior.
- Locale sync for user-facing labels and validation messages.

Example prompt:

`Use react-template-form-feature to create a profile form with name, role, and phone fields.`

## `react-template-table-feature`

Use when creating or refactoring table-driven pages.

Focus:

- Table handler/page split.
- Query + URL-synced state + filtering orchestration.
- `DataTable` and `Pagination` integration.
- `useTableState`, `FiltersPanel`, and `TableChipFilter` integration.
- Route wiring and locale sync.

Example prompt:

`Use react-template-table-feature to add a products table with search, status filters, and pagination.`

## `react-template-data-access-endpoint`

Use when adding or updating endpoint integration.

Focus:

- Add contracts in feature-scoped `<feature>.schema.ts` files.
- Add API functions in feature-scoped `<feature>.api.ts` files.
- Keep feature code free of direct `httpClient` usage.
- Sync Mockoon endpoints and payload shapes.

Example prompt:

`Use react-template-data-access-endpoint to add GET /products/:id with schema parsing and mock alignment.`

## Selection guide

- New/updated form workflow: choose `react-template-form-feature`.
- New table page workflow: choose `react-template-table-feature`.
- API contract or endpoint changes: choose `react-template-data-access-endpoint`.

## Fast workflow

1. Start from `AGENTS.md` to align with naming, imports, and routing rules.
2. Select one skill based on the task type.
3. Ask AI to generate the feature using that skill.
4. Run `pnpm run type-check` and `pnpm run build`.
