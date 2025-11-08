# React Template with Modern Stack

A comprehensive React TypeScript template built with Vite and modern development tools.

## 🚀 Technologies Included

- **⚡ Vite** - Next generation frontend tooling
- **⚛️ React 19** - Latest React with TypeScript support
- **🎨 Chakra UI** - Modern component library
- **🧭 React Router** - Declarative routing
- **🔍 TanStack Query** - Powerful data fetching and caching
- **📝 React Hook Form** - Performant forms with minimal re-renders
- **✅ Zod** - TypeScript-first schema validation
- **🌐 Ky** - Modern HTTP client based on fetch
- **📦 pnpm** - Fast, disk space efficient package manager

## 🛠️ Getting Started

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

## 🏗️ Project Structure

```
src/
├── pages/           # Page components
│   ├── HomePage.tsx
│   └── AboutPage.tsx
├── AppRouter.tsx    # React Router configuration
├── system.ts        # Chakra UI theme system
├── App.tsx          # Main App component
└── main.tsx         # Entry point
```

## 📋 Features Demonstrated

- **Routing**: Multiple pages with React Router
- **Styling**: Chakra UI components and theming
- **Data Fetching**: TanStack Query with ky HTTP client
- **Form Handling**: React Hook Form with Zod validation
- **Type Safety**: Full TypeScript integration

## 🎯 Example Usage

The template includes example implementations of:

- API data fetching with error handling
- Form validation with real-time feedback
- Navigation between pages
- Responsive design with Chakra UI

## 🧪 Development

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

### VS Code Tasks

The project includes VS Code tasks for:
- `dev` - Start development server (Ctrl+Shift+P → Tasks: Run Task → dev)
- `build` - Build project (Ctrl+Shift+P → Tasks: Run Build Task)

## 📚 Learn More

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [Chakra UI Documentation](https://v3.chakra-ui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Ky Documentation](https://github.com/sindresorhus/ky)
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
