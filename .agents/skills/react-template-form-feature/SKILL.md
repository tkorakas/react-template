---
name: react-template-form-feature
description: 'Create or refactor React template form features using index.tsx + use-handler.ts + schema.ts, React Hook Form with Zod, TanStack Query mutations, centralized data-access API calls, and en/el i18n keys.'
argument-hint: 'Feature name, fields, validation rules, submit API, and route path'
---

# React Template Form Feature

## What This Skill Produces

A complete form feature aligned with this repository pattern:

- `src/features/<feature>/index.tsx`: rendering and field wiring only
- `src/features/<feature>/use-handler.ts`: form setup, mutation, submit flow, navigation/toast behavior
- `src/features/<feature>/schema.ts`: Zod schema and inferred form type
- `src/data-access/api.ts`: submit/update API functions
- `public/locales/en/<namespace>.json` and `public/locales/el/<namespace>.json`: user-facing labels and validation messages

## When To Use

Use this skill when asked to:

- Add a new create/edit/auth form feature
- Refactor a feature to strict UI/handler/schema separation
- Standardize React Hook Form + Zod usage across a feature
- Move direct submit calls into centralized data-access

## Required Inputs

Collect or infer before coding:

- Feature path and route path
- Field list, types, required/optional status, defaults
- Validation rules and API error mapping expectations
- Submit endpoint and payload/response shapes
- Translation namespace and key naming

## Workflow

1. Build Validation Schema (`schema.ts`)

- Define Zod schema for all fields and cross-field constraints.
- Export the inferred form type from schema.
- Prefer translated messages when feature already uses i18n.

2. Build Handler (`use-handler.ts`)

- Create `useForm` with `zodResolver(schema)` and explicit `defaultValues`.
- Wire submit with `useMutation` from TanStack Query.
- Use API function(s) from `~/data-access/api`.
- Handle known API field errors via existing project helpers when available.
- Return `form`, `handleSubmit`, and loading state.

3. Build UI (`index.tsx`)

- Keep file focused on rendering and wiring only.
- Use reusable inputs from `~/common/ui` (`TextInput`, `Select`, `Radio`, `SimpleForm`, etc.).
- Wire form fields with `form.register(...)` or `Controller` for controlled inputs.
- Pass field errors from `form.formState.errors` into UI components.

4. Data Access Integration

- Add/update submit endpoint in `src/data-access/api.ts`.
- Parse API responses in data-access before returning, using schema parsers.
- Do not call `httpClient` directly in feature files.

5. Route and Locale Sync

- Register or update route in `src/common/router.tsx` if needed.
- Add/update keys in both locale files (`en` and `el`).
- Avoid hardcoded user-facing strings unless explicitly requested.

6. Verify

- Run `pnpm type-check`.
- Run `pnpm build` for route/UI changes.

## Decision Points

- `register` vs `Controller`:
  - Use `register` for standard input components.
  - Use `Controller` for composed/controlled components.

- Validation messages:
  - If feature uses i18n, source validation messages from translation keys.
  - For internal/demo-only forms, local string literals are acceptable.

- Post-submit behavior:
  - Navigate on success for workflow pages.
  - Show success toast for in-place or modal forms.

## Completion Checklist

- `schema.ts` exists and exports inferred form type.
- `use-handler.ts` owns form state and submit logic.
- `index.tsx` only renders/wires fields and actions.
- API submission happens via `src/data-access/api.ts`.
- Locale keys updated in both `en` and `el` if user-facing copy changed.
- `pnpm type-check` passes.
- `pnpm build` passes when route/UI changed.
