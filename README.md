# React Template

A reusable React + TypeScript template focused on practical app scaffolding: auth flows (including OAuth callback support), forms, table primitives, routing, and API integration.

## Tech stack

- Vite
- React 19
- TypeScript
- Chakra UI
- React Router
- TanStack Query
- React Hook Form + Zod
- Ky
- pnpm

## Getting started

### Prerequisites

- Node.js 20.19+ or 22.12+
- pnpm

### Installation

```bash
pnpm install
cp .env.dist .env
pnpm run dev
```

In another terminal, run your API mock with Mockoon (see next section).

## Mock API (Mockoon)

This template uses Mockoon instead of a custom Node mock server.

### Setup

1. Open Mockoon.
2. Import `react-template-api.json`.
3. Start the environment on port `3001`.

Vite is configured to proxy `/api/*` to `http://localhost:3001`, so frontend requests work without CORS changes.

### Included endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-mfa`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/auth/oauth/:provider/authorize`
- `POST /api/auth/oauth/:provider/callback`
- `GET /api/team-members`
- `POST /api/team-members`

## OAuth notes

OAuth UI flow is kept in the template.

- Login/Register pages include the OAuth button.
- Callback route is `/oauth/:provider/callback`.
- In Mockoon, the authorize endpoint returns a local callback URL with a mock code.

For real OAuth provider integration, replace mock endpoints with your backend implementation.

## Project structure

```text
src/
  common/
    ui/             # Shared UI primitives
      data/
      display/
      feedback/
      form/
      form-fields/
      layout/
  features/         # Feature pages and handlers
  ui/               # Reserved for project-specific UI surface (.gitkeep)
```

## Scripts

- `pnpm run dev` - start Vite dev server
- `pnpm run build` - type-check and production build
- `pnpm run test:run` - run tests once
- `pnpm run lint` - run ESLint

## Status highlights

- Auth flow (email/password + MFA + OAuth callback route)
- Registration and login forms with validation
- Shared table with sorting/filtering hooks
- Team members demo (list/create)
- i18n setup
