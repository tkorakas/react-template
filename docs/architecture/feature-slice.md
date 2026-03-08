# Feature Slice

## Feature folder pattern

For route features such as login, register, MFA, and team members, use:

```text
features/{feature}/
  {feature}.page.tsx
  {feature}.handler.ts
  {feature}.schema.ts
```

## Responsibilities

- `{feature}.page.tsx`
  UI rendering, field wiring, event hookups.
- `{feature}.handler.ts`
  Form state, query/mutation orchestration, navigation and side effects.
- `{feature}.schema.ts`
  Zod validation and inferred form data type.

## Why this split matters

- Keeps pages easy to scan and test.
- Makes data flows explicit and reusable.
- Prevents UI components from accumulating API and business rules.

## Examples in this repo

- `src/features/login`
- `src/features/register`
- `src/features/mfa`
- `src/features/advanced-form`
- `src/features/team-members`
