# React Template - Copilot Instructions

## Core Rules for Code Generation

- ALL file names must be kebab-case: `use-handler.ts`, `auth-manager.tsx`
- NEVER add comments in code files
- Features use `index.tsx` + `use-handler.ts` pattern
- Centralized `data-access/` folder for ALL API calls
- Use path aliases with `~` prefix for imports

## Project Structure

```
src/
├── common/
│   ├── auth/            # Authentication system (useAuth hook, route guards)
│   ├── http-client.ts   # Shared HTTP client with auth hooks
│   ├── query-client.ts  # Centralized TanStack Query client
│   ├── router.tsx       # Route configuration
│   └── system.ts        # Chakra UI design system
├── data-access/         # ALL API calls go here (centralized)
├── features/           # Feature-based organization
├── ui/                # Shared UI components only
└── main.tsx           # Application entry point
```

## Feature Architecture Pattern

Every feature follows this exact structure:

```
features/feature-name/
├── index.tsx          # UI component only - imports handler
├── use-handler.ts     # Business logic only - all state/API logic
└── schema.ts          # Zod validation schemas
```

## Template for New Features

### index.tsx Template

```tsx
import { useFeatureHandler } from './use-handler';

export default function FeaturePage() {
  const { data, handleAction, isLoading } = useFeatureHandler();
  return <div>{/* UI JSX only */}</div>;
}
```

### use-handler.ts Template

```tsx
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { getFeatures, createFeature } from '~/data-access/api';
import { schema } from './schema';

export function useFeatureHandler() {
  const navigate = useNavigate();
  const form = useForm({ resolver: zodResolver(schema) });

  const query = useQuery({
    queryKey: ['feature'],
    queryFn: getFeatures,
    select: data => data.items,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: createFeature,
    onSuccess: () => navigate('/success'),
  });

  return {
    form,
    data: query.data,
    isLoading: query.isPending || mutation.isPending,
    handleSubmit: form.handleSubmit(mutation.mutate),
  };
}
```

## Data Access Pattern

ALL API calls must go in `src/data-access/api.ts`:

```tsx
import { httpClient } from '~/common/http-client';

export const getFeatures = async () => httpClient.get('features').json();
export const createFeature = async data =>
  httpClient.post('features', { json: data }).json();
export const updateFeature = async (id, data) =>
  httpClient.put(`features/${id}`, { json: data }).json();
export const deleteFeature = async id =>
  httpClient.delete(`features/${id}`).json();
```

## Technology Stack Integration

- **React 19** + TypeScript strict mode
- **TanStack Query v5** - No retries globally, infinite stale time
- **React Hook Form** + Zod validation for all forms
- **Chakra UI v3** - Use components, not custom CSS
- **React Router v7** - Client-side navigation
- **Ky HTTP client** - All API requests via shared `httpClient` from `~/http-client`

## Authentication System

- Use `useAuth` from `~/common/auth/use-auth`
- `AuthManager` component handles loading states
- `PrivateRoute`/`PublicRoute` for route protection
- File-based session storage (not in-memory)
- HTTP client has auth hooks for 401 handling (auto-clears user cache)

## Query Client Configuration

```tsx
import { queryClient } from '~/common/query-client';
```

## Standard Query Patterns

```tsx
const { data, isPending } = useQuery({
  queryKey: ['resource'],
  queryFn: resourceApi.getAll,
  select: data => data.items,
  staleTime: Infinity,
});

const mutation = useMutation({
  mutationFn: resourceApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['resource'] });
    navigate('/success');
  },
});
```

## Naming Conventions

- **Files**: kebab-case (`use-handler.ts`, `private-route.tsx`)
- **Components**: PascalCase (`AuthManager`, `PrivateRoute`)
- **Functions/Hooks**: camelCase (`useAuth`, `getCurrentUser`)
- **Constants**: SCREAMING_SNAKE_CASE (`USER_QUERY_KEY`)

## Strict Rules - Never Do

- Add comments in code files
- Put business logic in index.tsx files
- Put UI logic in use-handler.ts files
- Make direct API calls from components
- Use PascalCase for file names
- Create separate data-access folders per feature
- Generate documentation files (README.md, ARCHITECTURE.md, etc.)

## Strict Rules - Always Do

- Separate UI (index.tsx) from logic (use-handler.ts)
- Use kebab-case for all file names
- Centralize ALL API calls in src/data-access/
- Use TypeScript strict mode
- Export default component from index.tsx
- Return object with named properties from handlers
- Use path aliases with ~ prefix

Zod instructions https://zod.dev/llms.txt
Chakra instructions https://chakra-ui.com/llms.txt
