# AGENTS.md

`AGENTS.md` defines the implementation contract for this repository.

## Key guidance encoded in AGENTS.md

- Tech stack expectations (React 19, strict TypeScript, TanStack Query, RHF + Zod, Chakra UI v3, Router v7, Ky, i18next).
- Feature file pattern and naming conventions.
- Import rules (`~/` alias and centralized API imports).
- Routing composition rules (PrivateRoute/PublicRoute + layout structure).
- i18n expectations (avoid hardcoded strings for user-facing copy).
- Verification commands (`pnpm type-check`, `pnpm build` when relevant).

## Practical impact

When adding or refactoring a feature:

1. Keep UI and logic separate.
2. Keep API access in `data-access`.
3. Use shared components from `~/common/ui`.
4. Update locale keys when introducing user-facing text.
5. Validate with type-check/build before handoff.
