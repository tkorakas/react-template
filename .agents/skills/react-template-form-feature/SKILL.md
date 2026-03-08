---
name: react-template-form-feature
description: 'Create or refactor React template form features from simple to advanced using {feature}.page.tsx + {feature}.handler.ts + {feature}.schema.ts with SimpleForm, FormProvider, shared form-fields, React Hook Form + Zod, TanStack Query, centralized data-access, and en/el i18n sync.'
argument-hint: 'Feature path, route path, field list, defaults, validation rules, options source, submit API, and post-submit behavior'
---

# React Template Form Feature

## What This Skill Produces

A complete form feature aligned with this repository pattern, from basic auth forms to advanced mixed-input forms:

- `src/features/<feature>/<feature>.page.tsx`: rendering and field wiring only
- `src/features/<feature>/<feature>.handler.ts`: form state, options, mutation, submit flow, navigation/toast behavior
- `src/features/<feature>/<feature>.schema.ts`: Zod schema and inferred form type
- `src/data-access/api.ts` (+ `api.schema.ts` when needed): centralized API integration
- `public/locales/en/<namespace>.json` and `public/locales/el/<namespace>.json`: user-facing labels and validation messages when copy changes

Use `src/features/advanced-form/*` as the baseline for shared field wiring and structure.

## When To Use

Use this skill when asked to:

- Add a new create/edit/auth form feature
- Build a complex form with mixed field types and cross-field validation
- Refactor a feature to strict UI/handler/schema separation
- Standardize React Hook Form + Zod usage across a feature
- Replace ad-hoc inputs with shared `~/common/ui` form field components
- Move direct submit calls into centralized data-access

## Required Inputs

Collect or infer before coding:

- Feature path and route path
- Full field inventory with types, required/optional status, and defaults
- Validation rules, including cross-field constraints and API error mapping expectations
- Option source for select-like fields (static or API)
- Submit endpoint, payload/response shapes, and post-submit behavior
- Translation namespace and key naming

## Shared Field Inventory And Wiring Rules

Choose components from `~/common/ui` and wire as follows:

- `TextInput`:
  Use `form.register('field')` and pass `error={form.formState.errors.field?.message}`.
- `Select`, `RadioGroup`, `CheckboxGroup`, `Combobox`, `AsyncMultiCombobox`, `DateSelector`, `DateRangePicker`, `Switch`, `Checkbox`, `PinInput`:
  Render under `FormProvider` so each component can use `useFormContext` + `Controller` internally.
- Select/combobox options:
  Use `{ label, value }` arrays; include `dotColor` only for `Select` when needed.
- Date range values:
  Persist ISO strings (`YYYY-MM-DD`) in form state.

## Workflow

1. Build Validation Schema (`<feature>.schema.ts`)

- Define Zod schema for all fields and cross-field constraints.
- For dependent fields, enforce relational rules with `.superRefine(...)`.
- Export the inferred form type from schema.
- Prefer translated messages when feature already uses i18n.

2. Build Handler (`<feature>.handler.ts`)

- Create `useForm` with `zodResolver(schema)` and explicit `defaultValues`.
- Keep options arrays in handler for UI consumption.
- Wire submit with `useMutation` from TanStack Query.
- Use API function(s) from `~/data-access/api`.
- Handle known API field errors via existing project helpers when available.
- Return only what UI needs: `form`, `handleSubmit`, loading state, options.
- Use `toaster` and navigation in mutation callbacks when required.

3. Build UI (`<feature>.page.tsx`)

- Keep file focused on rendering and wiring only.
- Wrap form with `<FormProvider {...form}>` and `<SimpleForm onSubmit={handleSubmit}>`.
- Use reusable inputs from `~/common/ui`.
- Use `register` for `TextInput`; rely on controller-backed shared components for complex inputs.
- Pass field errors from `form.formState.errors` into direct-register UI components.

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

## Decision Points And Branching Logic

- Field wiring choice:
  Use `register` only for `TextInput`; use shared controller-backed components for everything else.
- Options source:
  Static options stay in handler constants; remote options use query/mutation and map to `{ label, value }`.
- Validation location:
  Single-field rules in schema fields; relational constraints in `.superRefine`.
- Validation messages:
  If feature uses i18n, source validation messages from translation keys.
  For internal/demo-only forms, local string literals are acceptable.
- Post-submit behavior:
  Navigate on success for workflow pages; show success toast for in-place/modal forms.
- Date input mode:
  Use `DateSelector` for presets only; use `DateRangePicker` for explicit ranges.

## Known Gotchas To Enforce

- Always render controller-backed fields under `FormProvider`.
- Preserve blur/validation behavior expected by shared components.
- Keep overlay fields using portal layering as implemented in shared components.
- Normalize partial date range values to valid start/end pairs.
- Treat pin input as segmented UI but persist as a single string value.

## Completion Checklist

- `<feature>.schema.ts` exists and exports inferred form type.
- `<feature>.handler.ts` owns form state and submit logic.
- `<feature>.page.tsx` only renders/wires fields and actions.
- Shared fields from `~/common/ui` are used with correct wiring pattern.
- API submission happens via `src/data-access/api.ts`.
- Locale keys updated in both `en` and `el` if user-facing copy changed.
- `pnpm type-check` passes.
- `pnpm build` passes when route/UI changed.
