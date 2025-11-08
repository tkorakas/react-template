# React Template

A comprehensive React TypeScript template built with Vite and modern development tools.

## Tech stack

- ** Vite** - Next generation frontend tooling
- ** React 19** - Latest React with TypeScript support
- ** Chakra UI** - Modern component library
- ** React Router** - Declarative routing
- ** TanStack Query** - Powerful data fetching and caching
- ** React Hook Form** - Performant forms with minimal re-renders
- ** Zod** - TypeScript-first schema validation
- ** Ky** - Modern HTTP client based on fetch
- ** pnpm** - Fast, disk space efficient package manager

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Project Structure

```
src/
├── ui/      # Reusable components
│   ├── button.tsx
│   └── index.ts
├── features/        # Features, usually individual pages
│   ├── login/
│   │   ├── index.tsx        # Template
│   │   └── use-handler.tsx  # View model
│   └── register/
│       ├── index.tsx        # Template
│       └── use-handler.tsx  # View model
├── router.tsx       # React Router configuration
├── system.ts        # Chakra UI theme system
└── main.tsx         # Entry point
```

## Path Aliases

The project is configured with path aliases for cleaner imports:

- `~/` → `src/` directory

**Example usage:**

```typescript
// Instead of: import { Button } from '../../components/Button'
import { Button } from '~/components';

// Instead of: import { router } from './router'
import { router } from '~/router';
```

## Mock Server

This template includes a mock API server for development purposes:

### Starting the Mock Server

```bash
# Start the mock server (runs on http://localhost:3001)
pnpm run mock-server:dev
```

### Available Endpoints

- `GET /api/todos` - Get todos with pagination
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

The mock server uses an in-memory database and loads initial data from `mock-server/data/todos.json`.

### Frontend Integration

The Vite development server is configured with a proxy that automatically forwards `/api/*` requests to the mock server, eliminating CORS issues:

```typescript
// This request goes to http://localhost:3001/api/todos
const response = await api.get('api/todos');
```

## Development

### Starting Development

1. Start the mock server:

   ```bash
   pnpm run mock-server:dev
   ```

2. Start the frontend development server:

   ```bash
   pnpm run dev
   ```

3. Open http://localhost:5174 (or the port shown in terminal)

## Features

The template includes example implementations of:

- API data fetching with error handling and schema validation
- Form validation with real-time feedback
- Mock API server with TypeScript and Zod validation
- Vite proxy configuration for seamless frontend-backend development

### Implementation Status

- [x] Router, forms, Http client, validation, UI library
- [x] Linting & testing
- [x] Mock server with Express and TypeScript
- [x] Vite proxy configuration
- [ ] Auth flow
      -- [ ] Email login
      -- [ ] OTP  
       -- [ ] Google login
      -- [ ] GitHub login
- [ ] Advanced features
      -- [ ] LLM instructions https://zod.dev/llms.txt https://chakra-ui.com/llms.txt
      -- [ ] Advanced Chakra UI integration
      -- [ ] Wire UI components with RHF
      -- [ ] User settings
      -- [ ] Edit/Create modal
      -- [ ] Table with sorting and filtering
