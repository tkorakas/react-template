# Introduction

## Project purpose

`react-template` is a reusable frontend starter that demonstrates how to build maintainable product features with consistent patterns.

It is intentionally opinionated about:

- Feature structure (`.page.tsx`, `.handler.ts`, `.schema.ts`).
- API boundaries (all calls in `src/data-access/api.ts`).
- Shared UI primitives under `src/common/ui`.
- Route guard and layout composition.

## Prerequisites

- Node.js `20.19+` or `22.12+`
- pnpm
- Mockoon for local API simulation

## Installation

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

This project uses Mockoon with `react-template-api.json`.

1. Open Mockoon.
2. Import `react-template-api.json`.
3. Start the environment on port `3001`.

The frontend proxies `/api/*` to `http://localhost:3001` in development.

## Useful scripts

- `pnpm run dev`: start app dev server.
- `pnpm run build`: app production build.
- `pnpm run type-check`: TypeScript validation.
- `pnpm docs:dev`: docs dev server.
- `pnpm docs:build`: docs production build.
- `pnpm docs:preview`: preview docs build locally.
