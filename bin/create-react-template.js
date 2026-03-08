#!/usr/bin/env node

import { constants } from 'node:fs';
import { access, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateRoot = path.resolve(__dirname, '..');

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function removeIfExists(filePath) {
  if (await exists(filePath)) {
    await rm(filePath, { recursive: true, force: true });
  }
}

function toPackageName(projectName) {
  return (
    projectName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_.]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'my-react-app'
  );
}

function parseYesNo(value) {
  const answer = value.trim().toLowerCase();
  if (['y', 'yes'].includes(answer)) return true;
  if (['n', 'no'].includes(answer)) return false;
  return null;
}

async function askYesNo(rl, question) {
  // Keep prompting until user provides an explicit yes/no answer.
  for (;;) {
    const inputValue = await rl.question(`${question} (y/n): `);
    const parsed = parseYesNo(inputValue);
    if (parsed !== null) {
      return parsed;
    }
    output.write('Please answer with y/yes or n/no.\n');
  }
}

function buildRouterTs(config) {
  const { auth, login, register, mfa, oauth, advancedForm } = config;

  const protectedRoutes = [
    `          {\n            path: '/',\n            element: withSuspense(HomePage, 'home-page'),\n          },`,
    `          {\n            path: '/team-members',\n            element: withSuspense(TeamMembersPage, 'team-members'),\n            children: [\n              {\n                path: 'create',\n                element: withSuspense(CreateTeamMemberPage, 'create-team-member'),\n              },\n            ],\n          },`,
  ];

  if (advancedForm) {
    protectedRoutes.push(
      `          {\n            path: '/advanced-form',\n            element: withSuspense(AdvancedFormPage, 'advanced-form'),\n          },`
    );
  }

  if (!auth) {
    return `import { Suspense, lazy, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { AppLayout, Loading } from '~/common/ui';

const HomePage = lazy(() => import('~/features/home-page'));
const TeamMembersPage = lazy(
  () => import('~/features/team-members/team-members.page')
);
const CreateTeamMemberPage = lazy(
  () => import('~/features/team-members/create/create-team-member.page')
);
${
  advancedForm
    ? `const AdvancedFormPage = lazy(
  () => import('~/features/advanced-form/advanced-form.page')
);
`
    : ''
}const withSuspense = (Component: ComponentType, key: string) => (
  <Suspense key={key} fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
${protectedRoutes.join('\n')}
    ],
  },
]);
`;
  }

  const hasAuthLayoutRoutes = login || register || mfa;
  const authImports = [];

  if (login) {
    authImports.push(
      `const LoginPage = lazy(() => import('~/features/login/login.page'));`
    );
  }

  if (register) {
    authImports.push(
      `const RegisterPage = lazy(() => import('~/features/register/register.page'));`
    );
  }

  if (mfa) {
    authImports.push(
      `const MfaPage = lazy(() => import('~/features/mfa/mfa.page'));`
    );
  }

  if (oauth) {
    authImports.push(
      `const OAuthCallbackPage = lazy(
  () => import('~/features/oauth/oauth-callback.page')
);`
    );
  }

  if (advancedForm) {
    authImports.push(
      `const AdvancedFormPage = lazy(
  () => import('~/features/advanced-form/advanced-form.page')
);`
    );
  }

  const authLayoutRoutes = [];
  if (login) {
    authLayoutRoutes.push(
      `          {\n            path: '/login',\n            element: withSuspense(LoginPage, 'login-page'),\n          },`
    );
  }
  if (register) {
    authLayoutRoutes.push(
      `          {\n            path: '/register',\n            element: withSuspense(RegisterPage, 'register-page'),\n          },`
    );
  }
  if (mfa) {
    authLayoutRoutes.push(
      `          {\n            path: '/mfa',\n            element: withSuspense(MfaPage, 'mfa-page'),\n          },`
    );
  }

  const publicChildren = [];

  if (hasAuthLayoutRoutes) {
    publicChildren.push(`      {
        element: <AuthLayout />,
        children: [
${authLayoutRoutes.join('\n')}
        ],
      },`);
  }

  if (oauth) {
    publicChildren.push(`      {
        path: '/oauth/:provider/callback',
        element: withSuspense(OAuthCallbackPage, 'oauth-callback-page'),
      },`);
  }

  return `import { Suspense, lazy, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { PrivateRoute, PublicRoute } from '~/common/auth';
import { AppLayout, AuthLayout, Loading } from '~/common/ui';

const HomePage = lazy(() => import('~/features/home-page'));
const TeamMembersPage = lazy(
  () => import('~/features/team-members/team-members.page')
);
const CreateTeamMemberPage = lazy(
  () => import('~/features/team-members/create/create-team-member.page')
);
${authImports.join('\n')}
const withSuspense = (Component: ComponentType, key: string) => (
  <Suspense key={key} fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
${protectedRoutes.join('\n')}
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
${publicChildren.join('\n')}
    ],
  },
]);
`;
}

function buildMainTs({ auth }) {
  if (auth) {
    return `import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { AuthManager } from '~/common/auth';
import '~/common/i18n';
import { queryClient } from '~/common/query-client';
import { router } from '~/common/router';
import { system } from '~/common/system';
import { DialogProvider, Loading, Toaster } from '~/common/ui';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <Suspense fallback={<Loading />}>
          <DialogProvider>
            <AuthManager>
              <RouterProvider router={router} />
            </AuthManager>
          </DialogProvider>
        </Suspense>
        <Toaster />
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
`;
  }

  return `import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import '~/common/i18n';
import { queryClient } from '~/common/query-client';
import { router } from '~/common/router';
import { system } from '~/common/system';
import { DialogProvider, Loading, Toaster } from '~/common/ui';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <Suspense fallback={<Loading />}>
          <DialogProvider>
            <RouterProvider router={router} />
          </DialogProvider>
        </Suspense>
        <Toaster />
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
`;
}

function buildAppLayoutTs({ auth, advancedForm }) {
  const advancedNavEntry = advancedForm
    ? `  { nameKey: 'navigation.advancedForm', path: '/advanced-form' },\n`
    : '';

  if (auth) {
    return `import {
  Box,
  Container,
  Flex,
  HStack,
  Menu,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '~/common/auth';

const navigation = [
  { nameKey: 'navigation.home', path: '/' },
  { nameKey: 'navigation.teamMembers', path: '/team-members' },
${advancedNavEntry}];

export function AppLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <Flex minH="100vh" bg="gray.50">
      <Box
        as="nav"
        w="250px"
        bg="white"
        borderRightWidth="1px"
        borderColor="gray.200"
        p={4}
      >
        <VStack align="stretch" gap={2}>
          <Text fontSize="xl" fontWeight="bold" mb={4} px={3}>
            {t('appName')}
          </Text>
          {navigation.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'block',
                padding: 'var(--chakra-spacing-2) var(--chakra-spacing-3)',
                borderRadius: 'var(--chakra-radii-md)',
                backgroundColor: isActive
                  ? 'var(--chakra-colors-blue-50)'
                  : 'transparent',
                color: isActive
                  ? 'var(--chakra-colors-blue-600)'
                  : 'var(--chakra-colors-gray-700)',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s',
              })}
            >
              {t(item.nameKey)}
            </NavLink>
          ))}
        </VStack>
      </Box>

      <Flex flex="1" direction="column">
        <Box
          as="header"
          bg="white"
          borderBottomWidth="1px"
          borderColor="gray.200"
          px={6}
          py={3}
        >
          <Flex justify="flex-end" align="center">
            <HStack gap={4}>
              <Text fontSize="sm" color="gray.600">
                {user?.name}
              </Text>

              <Menu.Root
                positioning={{
                  placement: 'bottom-end',
                  offset: { mainAxis: 8 },
                }}
              >
                <Menu.Trigger asChild>
                  <Box
                    as="button"
                    w="10"
                    h="10"
                    borderRadius="full"
                    bg="blue.500"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                    fontSize="sm"
                    cursor="pointer"
                    _hover={{ bg: 'blue.600' }}
                    transition="all 0.2s"
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Box>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content minW="150px">
                      <Menu.Item
                        value="logout"
                        color="red.500"
                        onClick={logout}
                      >
                        {t('actions.logout')}
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </HStack>
          </Flex>
        </Box>

        <Box as="main" flex="1" overflowY="auto">
          <Container maxW="container.xl" py={6}>
            <Outlet />
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
}
`;
  }

  return `import { Box, Container, Flex, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';

const navigation = [
  { nameKey: 'navigation.home', path: '/' },
  { nameKey: 'navigation.teamMembers', path: '/team-members' },
${advancedNavEntry}];

export function AppLayout() {
  const { t } = useTranslation();

  return (
    <Flex minH="100vh" bg="gray.50">
      <Box
        as="nav"
        w="250px"
        bg="white"
        borderRightWidth="1px"
        borderColor="gray.200"
        p={4}
      >
        <VStack align="stretch" gap={2}>
          <Text fontSize="xl" fontWeight="bold" mb={4} px={3}>
            {t('appName')}
          </Text>
          {navigation.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'block',
                padding: 'var(--chakra-spacing-2) var(--chakra-spacing-3)',
                borderRadius: 'var(--chakra-radii-md)',
                backgroundColor: isActive
                  ? 'var(--chakra-colors-blue-50)'
                  : 'transparent',
                color: isActive
                  ? 'var(--chakra-colors-blue-600)'
                  : 'var(--chakra-colors-gray-700)',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s',
              })}
            >
              {t(item.nameKey)}
            </NavLink>
          ))}
        </VStack>
      </Box>

      <Flex flex="1" direction="column">
        <Box as="main" flex="1" overflowY="auto">
          <Container maxW="container.xl" py={6}>
            <Outlet />
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
}
`;
}

function buildHttpClientTs({ auth }) {
  if (!auth) {
    return `import ky from 'ky';

export const httpClient = ky.create({
  prefixUrl: '/api',
  credentials: 'include',
  timeout: 10000,
});
`;
  }

  return `import ky from 'ky';
import { hooks } from './auth/auth-hooks';

export const httpClient = ky.create({
  prefixUrl: '/api',
  credentials: 'include',
  timeout: 10000,
  hooks,
});
`;
}

function buildI18nTs({ auth, login, register, mfa }) {
  const namespaces = ['common', 'team-members'];

  if (auth) {
    namespaces.push('auth');
    if (login) namespaces.push('login');
    if (register) namespaces.push('register');
    if (mfa) namespaces.push('mfa');
  }

  const namespaceEntries = namespaces.map(value => `  '${value}',`).join('\n');

  return `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

export const supportedLanguages = ['en', 'el'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const namespaces = [
${namespaceEntries}
] as const;

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    defaultNS: 'common',
    ns: namespaces,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'i18nextLng',
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;
`;
}

function buildUiIndexTs({ auth }) {
  return auth
    ? `export { AppLayout } from './layout/app-layout';
export { AuthLayout } from './layout/auth-layout';

export { Loading } from './display/loading';

export {
  DataTable,
  type Cell,
  type ColumnDef,
  type Header,
  type Row,
  type RowSelectionState,
  type SortingState,
} from './data/data-table';
export { Pagination } from './data/pagination';
export { RowActionMenu } from './data/row-action-menu';
export { TableLoader, type TableLoaderProps } from './data/table-loader';
export {
  TableRowColorIndicator,
  type TableRowColorIndicatorProps,
} from './data/table-row-color-indicator';
export { UserAvatar } from './data/user-avatar';

export { Drawer } from './feedback/drawer';
export { DialogProvider } from './feedback/dialog-provider';
export { Toaster, toaster } from './feedback/toaster';
export { useDialog } from './feedback/use-dialog';

export { SimpleForm } from './form/simple-form';

export { AsyncMultiCombobox } from './form-fields/async-multi-combobox';
export { Checkbox } from './form-fields/checkbox';
export { Combobox } from './form-fields/combobox';
export {
  DateRangePicker,
  type DateRangeValue,
} from './form-fields/date-range-picker';
export { DateRangeSelector } from './form-fields/date-range-selector';
export {
  DATE_PRESETS,
  DateSelector,
  getDateRangeFromPreset,
  type DatePreset,
  type DateRange,
} from './form-fields/date-selector';
export { MultiCheckbox } from './form-fields/multi-checkbox';
export { PinInput } from './form-fields/pin-input';
export { RadioGroup } from './form-fields/radio-group';
export { Select } from './form-fields/select';
export { Switch } from './form-fields/switch';
export { TextInput } from './form-fields/text-input';

export { TableActionBar } from './table/action-bar';
export { FiltersPanel } from './table/filters-panel';
export {
  countActiveFilters,
  hasActiveFilters,
  hasFiltersChanged,
} from './table/filters.utils';
export {
  TableChipFilter,
  type TableChipFilterOption,
} from './table/table-chip-filter';
export { useTableState } from './table/use-table-state';
`
    : `export { AppLayout } from './layout/app-layout';

export { Loading } from './display/loading';

export {
  DataTable,
  type Cell,
  type ColumnDef,
  type Header,
  type Row,
  type RowSelectionState,
  type SortingState,
} from './data/data-table';
export { Pagination } from './data/pagination';
export { RowActionMenu } from './data/row-action-menu';
export { TableLoader, type TableLoaderProps } from './data/table-loader';
export {
  TableRowColorIndicator,
  type TableRowColorIndicatorProps,
} from './data/table-row-color-indicator';
export { UserAvatar } from './data/user-avatar';

export { Drawer } from './feedback/drawer';
export { DialogProvider } from './feedback/dialog-provider';
export { Toaster, toaster } from './feedback/toaster';
export { useDialog } from './feedback/use-dialog';

export { SimpleForm } from './form/simple-form';

export { AsyncMultiCombobox } from './form-fields/async-multi-combobox';
export { Checkbox } from './form-fields/checkbox';
export { Combobox } from './form-fields/combobox';
export {
  DateRangePicker,
  type DateRangeValue,
} from './form-fields/date-range-picker';
export { DateRangeSelector } from './form-fields/date-range-selector';
export {
  DATE_PRESETS,
  DateSelector,
  getDateRangeFromPreset,
  type DatePreset,
  type DateRange,
} from './form-fields/date-selector';
export { MultiCheckbox } from './form-fields/multi-checkbox';
export { PinInput } from './form-fields/pin-input';
export { RadioGroup } from './form-fields/radio-group';
export { Select } from './form-fields/select';
export { Switch } from './form-fields/switch';
export { TextInput } from './form-fields/text-input';

export { TableActionBar } from './table/action-bar';
export { FiltersPanel } from './table/filters-panel';
export {
  countActiveFilters,
  hasActiveFilters,
  hasFiltersChanged,
} from './table/filters.utils';
export {
  TableChipFilter,
  type TableChipFilterOption,
} from './table/table-chip-filter';
export { useTableState } from './table/use-table-state';
`;
}

async function pruneMockoon(filePath, config) {
  if (!(await exists(filePath))) return;

  const content = await readFile(filePath, 'utf8');
  const mockoon = JSON.parse(content);
  if (!Array.isArray(mockoon.routes)) return;

  mockoon.routes = mockoon.routes.filter(route => {
    const endpoint = route?.endpoint;
    if (typeof endpoint !== 'string') return true;

    if (!config.auth) {
      return !endpoint.startsWith('api/auth');
    }

    if (!config.oauth && endpoint.startsWith('api/auth/oauth/')) {
      return false;
    }

    if (!config.register && endpoint === 'api/auth/register') {
      return false;
    }

    if (!config.mfa && endpoint === 'api/auth/verify-mfa') {
      return false;
    }

    return true;
  });

  await writeFile(filePath, `${JSON.stringify(mockoon, null, 2)}\n`, 'utf8');
}

async function removeLogoutAction(localeCommonPath) {
  if (!(await exists(localeCommonPath))) return;

  const content = await readFile(localeCommonPath, 'utf8');
  const parsed = JSON.parse(content);

  if (parsed.actions && typeof parsed.actions === 'object') {
    delete parsed.actions.logout;
  }

  await writeFile(
    localeCommonPath,
    `${JSON.stringify(parsed, null, 2)}\n`,
    'utf8'
  );
}

async function copyTemplate(destinationDir) {
  await cp(templateRoot, destinationDir, {
    recursive: true,
    filter: src => {
      const relative = path.relative(templateRoot, src);

      if (!relative) return true;

      const firstSegment = relative.split(path.sep)[0];
      const blocked = new Set([
        '.git',
        'node_modules',
        'dist',
        '.DS_Store',
        'bin',
      ]);

      if (blocked.has(firstSegment)) {
        return false;
      }

      return true;
    },
  });
}

async function updateOutputPackageJson(destinationDir, projectName) {
  const packageJsonPath = path.join(destinationDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

  packageJson.name = toPackageName(projectName);
  delete packageJson.bin;

  await writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    'utf8'
  );
}

async function applyFeatureSelection(destinationDir, config) {
  const removePaths = [];

  if (!config.auth) {
    removePaths.push(
      'src/common/auth',
      'src/data-access/auth',
      'src/features/login',
      'src/features/register',
      'src/features/mfa',
      'src/features/oauth',
      'public/locales/en/auth.json',
      'public/locales/el/auth.json',
      'public/locales/en/login.json',
      'public/locales/el/login.json',
      'public/locales/en/register.json',
      'public/locales/el/register.json',
      'public/locales/en/mfa.json',
      'public/locales/el/mfa.json'
    );
  } else {
    if (!config.login) {
      removePaths.push(
        'src/features/login',
        'public/locales/en/login.json',
        'public/locales/el/login.json'
      );
    }

    if (!config.register) {
      removePaths.push(
        'src/features/register',
        'public/locales/en/register.json',
        'public/locales/el/register.json'
      );
    }

    if (!config.mfa) {
      removePaths.push(
        'src/features/mfa',
        'public/locales/en/mfa.json',
        'public/locales/el/mfa.json'
      );
    }

    if (!config.oauth) {
      removePaths.push('src/features/oauth');
    }
  }

  if (!config.advancedForm) {
    removePaths.push('src/features/advanced-form');
  }

  for (const relativePath of removePaths) {
    await removeIfExists(path.join(destinationDir, relativePath));
  }

  await writeFile(
    path.join(destinationDir, 'src/common/router.tsx'),
    buildRouterTs(config),
    'utf8'
  );
  await writeFile(
    path.join(destinationDir, 'src/main.tsx'),
    buildMainTs(config),
    'utf8'
  );
  await writeFile(
    path.join(destinationDir, 'src/common/ui/layout/app-layout.tsx'),
    buildAppLayoutTs(config),
    'utf8'
  );
  await writeFile(
    path.join(destinationDir, 'src/common/http-client.ts'),
    buildHttpClientTs(config),
    'utf8'
  );
  await writeFile(
    path.join(destinationDir, 'src/common/ui/index.ts'),
    buildUiIndexTs(config),
    'utf8'
  );
  await writeFile(
    path.join(destinationDir, 'src/common/i18n.ts'),
    buildI18nTs(config),
    'utf8'
  );

  if (!config.auth) {
    await removeLogoutAction(
      path.join(destinationDir, 'public/locales/en/common.json')
    );
    await removeLogoutAction(
      path.join(destinationDir, 'public/locales/el/common.json')
    );
  }

  await pruneMockoon(
    path.join(destinationDir, 'mocks/api.mockoon.json'),
    config
  );
}

async function run() {
  const rl = createInterface({ input, output });

  try {
    const cliProjectName = process.argv[2];
    const projectName = cliProjectName
      ? cliProjectName.trim()
      : (await rl.question('Project name: ')).trim();

    if (!projectName) {
      throw new Error('Project name is required.');
    }

    const auth = await askYesNo(rl, 'Do you want auth?');

    let login = false;
    let register = false;
    let mfa = false;
    let oauth = false;

    if (auth) {
      register = await askYesNo(rl, 'Do you want registration?');
      login = await askYesNo(rl, 'Do you want login?');
      mfa = await askYesNo(rl, 'Do you want mfa?');
      oauth = await askYesNo(rl, 'Do you want oauth?');

      if (!login) {
        output.write(
          'Login has been enabled automatically because auth flow redirects unauthenticated users to /login.\n'
        );
        login = true;
      }
    }

    const advancedForm = await askYesNo(
      rl,
      'Do you want form examples (advanced form)?'
    );

    const destinationDir = path.resolve(process.cwd(), projectName);

    if (await exists(destinationDir)) {
      throw new Error(`Target directory already exists: ${destinationDir}`);
    }

    const config = {
      auth,
      login,
      register,
      mfa,
      oauth,
      advancedForm,
    };

    output.write('\nSelected features:\n');
    output.write(`- auth: ${config.auth ? 'yes' : 'no'}\n`);
    output.write(`- login: ${config.login ? 'yes' : 'no'}\n`);
    output.write(`- register: ${config.register ? 'yes' : 'no'}\n`);
    output.write(`- mfa: ${config.mfa ? 'yes' : 'no'}\n`);
    output.write(`- oauth: ${config.oauth ? 'yes' : 'no'}\n`);
    output.write(`- advanced form: ${config.advancedForm ? 'yes' : 'no'}\n\n`);

    const proceed = await askYesNo(rl, 'Create project with these options?');
    if (!proceed) {
      output.write('Cancelled.\n');
      return;
    }

    await mkdir(destinationDir, { recursive: true });

    try {
      await copyTemplate(destinationDir);
      await updateOutputPackageJson(destinationDir, projectName);
      await applyFeatureSelection(destinationDir, config);
    } catch (error) {
      await rm(destinationDir, { recursive: true, force: true });
      throw error;
    }

    output.write(`\nProject created at ${destinationDir}\n`);
    output.write('Next steps:\n');
    output.write(`  cd ${projectName}\n`);
    output.write('  pnpm install\n');
    output.write('  pnpm type-check\n');
    output.write('  pnpm build\n');
  } finally {
    rl.close();
  }
}

run().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
