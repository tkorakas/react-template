---
name: react-template-data-access-endpoint
description: 'Add or refactor API endpoints in this React template by updating api.schema.ts parsers, api.ts functions, and mocks/api.mockoon.json while keeping feature code free of direct http-client calls.'
argument-hint: 'Endpoint path, method, request payload, response shape, and consumers'
---

# React Template Data Access Endpoint

## What This Skill Produces

A safe endpoint integration with aligned parsing and mocks:

- `src/data-access/api.schema.ts`: Zod request/response contracts
- `src/data-access/api.ts`: exported API function(s) that parse responses
- `mocks/api.mockoon.json`: endpoint and response shape alignment
- Feature consumers updated to import from `~/data-access/api`

## When To Use

Use this skill when asked to:

- Add a new backend endpoint to the frontend
- Refactor existing API access to typed parsing
- Fix drift between frontend contracts and Mockoon mocks
- Remove direct `httpClient` usage from features

## Required Inputs

Collect or infer before coding:

- HTTP method and endpoint path
- Request payload and query params
- Response contract (success and expected error formats)
- Calling features and query/mutation usage
- Mockoon behavior required for local/dev flows

## Workflow

1. Define or Update Schemas

- Add request/response Zod schemas and exported types in `api.schema.ts`.
- Keep parsers internal to data-access.
- Validate nested collections/pagination contracts explicitly.

2. Implement API Function

- Add exported function in `api.ts` using `httpClient`.
- Parse JSON response with schema before returning.
- Keep transport concerns (paths, params, body) inside data-access.

3. Update Callers

- Ensure features import API functions from `~/data-access/api`.
- Remove direct `httpClient` calls from feature files.
- Keep feature handlers focused on query/mutation orchestration.

4. Sync Mocks

- Update `mocks/api.mockoon.json` for endpoint path and response shape.
- Keep paths aligned with `/api` prefix conventions.
- Ensure mock payloads satisfy Zod parsers.

5. Verify

- Run `pnpm type-check`.
- Run `pnpm build` if API changes affect route-level features.
- Smoke-test key flows that depend on changed endpoints.

## Decision Points

- Schema strictness:
  - Prefer strict object shapes for core entities.
  - Use optional/nullish fields only when backend actually returns them.

- Function granularity:
  - Keep one API function per endpoint/action.
  - Share helper builders only if duplication is substantial.

- Error handling:
  - Normalize known backend error states where the app has explicit flows.
  - Let unknown errors propagate for global handling/toasts.

## Completion Checklist

- Endpoint contracts exist in `api.schema.ts`.
- API function exists in `api.ts` and returns parsed data.
- No direct feature-level `httpClient` calls remain for changed flows.
- Mockoon endpoint is aligned with path and contract.
- `pnpm type-check` passes.
- `pnpm build` passes when affected UI/routes changed.
