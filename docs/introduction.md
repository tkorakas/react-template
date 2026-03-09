# Introduction

## Project purpose

`react-template` is a reusable frontend starter that demonstrates how to build maintainable product features with consistent patterns.

Repository: https://github.com/tkorakas/react-template

It is intentionally opinionated about:

- Feature structure (`.page.tsx`, `.handler.ts`, `.schema.ts`).
- API boundaries (all calls in `src/data-access/<feature>/<feature>.api.ts`).
- Shared UI primitives under `src/common/ui`.
- Route guard and layout composition.

## Prerequisites

- Node.js `20.19+` or `22.12+`
- pnpm
- Mockoon for local API simulation

## Create a project from this template

```bash
npx @tkorakas/create-react-template my-app
cd my-app
pnpm install
pnpm run dev
```

If npm metadata is delayed on your region/registry edge, use:

```bash
npx github:tkorakas/react-template my-app
```

## Installation

This section is for working on the template repository itself.

```bash
pnpm install
cp .env.dist .env
```

## Run the app

```bash
pnpm run dev
```

## Run the docs

```bash
pnpm docs:dev
```

## Mock API

This project uses Mockoon with `mocks/api.mockoon.json`.

1. Open Mockoon.
2. Import `mocks/api.mockoon.json`.
3. Start the environment on port `3001`.

The frontend proxies `/api/*` to `http://localhost:3001` in development.

## Useful scripts

- `pnpm run dev`: start app dev server.
- `pnpm run build`: app production build.
- `pnpm run type-check`: TypeScript validation.
- `pnpm docs:dev`: docs dev server.
- `pnpm docs:build`: docs production build.
- `pnpm docs:preview`: preview docs build locally.
