# Installation

## Create a new app

Use the template generator:

```bash
npx @tkorakas/create-react-template@latest my-app
cd my-app
pnpm install
pnpm run dev
```

If npm metadata is delayed on your registry edge, use:

```bash
npx github:tkorakas/react-template my-app
```

## What the generator asks

During setup, the CLI prompts for feature selection:

- `auth`
- `login`
- `register`
- `mfa`
- `oauth`
- `advanced-form`

The scaffold includes only what you select, so generated apps stay lean.

## Work on this repository

If you are contributing to the template itself:

```bash
pnpm install
cp .env.dist .env
pnpm run dev
```

For docs:

```bash
pnpm docs:dev
```
