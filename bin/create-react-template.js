#!/usr/bin/env node

import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  outro,
  text,
} from '@clack/prompts';
import { constants } from 'node:fs';
import { access, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateRoot = path.resolve(__dirname, '..');
const generatorTemplateDir = path.resolve(__dirname, 'templates');
const templateCache = new Map();

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

function handlePromptCancel(value) {
  if (!isCancel(value)) return;
  cancel('Cancelled.');
  process.exit(0);
}

async function askText(message, defaultValue) {
  const value = await text({
    message,
    defaultValue,
    validate: inputValue =>
      inputValue.trim().length > 0 ? undefined : 'Please enter a project name.',
  });
  handlePromptCancel(value);
  return String(value).trim();
}

async function askConfirm(message, initialValue = true) {
  const value = await confirm({ message, initialValue });
  handlePromptCancel(value);
  return value;
}

async function loadTemplate(templateName) {
  const cached = templateCache.get(templateName);
  if (cached) return cached;

  const templatePath = path.join(generatorTemplateDir, templateName);
  const template = await readFile(templatePath, 'utf8');
  templateCache.set(templateName, template);
  return template;
}

function renderTemplate(template, values = {}) {
  return Object.entries(values).reduce(
    (output, [key, value]) => output.replaceAll(`{{${key}}}`, value),
    template
  );
}

async function buildRouterTs(config) {
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
    const template = await loadTemplate('router.no-auth.tsx.tpl');
    const advancedFormImport = advancedForm
      ? `const AdvancedFormPage = lazy(\n  () => import('~/features/advanced-form/advanced-form.page')\n);\n`
      : '';

    return renderTemplate(template, {
      ADVANCED_FORM_IMPORT: advancedFormImport,
      PROTECTED_ROUTES: protectedRoutes.join('\n'),
    });
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
      `const OAuthCallbackPage = lazy(\n  () => import('~/features/oauth/oauth-callback.page')\n);`
    );
  }

  if (advancedForm) {
    authImports.push(
      `const AdvancedFormPage = lazy(\n  () => import('~/features/advanced-form/advanced-form.page')\n);`
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

  const template = await loadTemplate('router.auth.tsx.tpl');
  return renderTemplate(template, {
    AUTH_IMPORTS: authImports.join('\n'),
    PROTECTED_ROUTES: protectedRoutes.join('\n'),
    PUBLIC_CHILDREN: publicChildren.join('\n'),
  });
}

async function buildMainTs({ auth }) {
  return loadTemplate(auth ? 'main.auth.tsx.tpl' : 'main.no-auth.tsx.tpl');
}

async function buildAppLayoutTs({ auth, advancedForm }) {
  const template = await loadTemplate(
    auth ? 'app-layout.auth.tsx.tpl' : 'app-layout.no-auth.tsx.tpl'
  );

  const advancedNavEntry = advancedForm
    ? `  { nameKey: 'navigation.advancedForm', path: '/advanced-form' },\n`
    : '';

  return renderTemplate(template, {
    ADVANCED_NAV_ENTRY: advancedNavEntry,
  });
}

async function buildHttpClientTs({ auth }) {
  return loadTemplate(
    auth ? 'http-client.auth.ts.tpl' : 'http-client.no-auth.ts.tpl'
  );
}

async function buildI18nTs({ auth, login, register, mfa }) {
  const namespaces = ['common', 'team-members'];

  if (auth) {
    namespaces.push('auth');
    if (login) namespaces.push('login');
    if (register) namespaces.push('register');
    if (mfa) namespaces.push('mfa');
  }

  const namespaceEntries = namespaces.map(value => `  '${value}',`).join('\n');
  const template = await loadTemplate('i18n.ts.tpl');

  return renderTemplate(template, {
    NAMESPACE_ENTRIES: namespaceEntries,
  });
}

async function buildUiIndexTs({ auth }) {
  return loadTemplate(
    auth ? 'ui-index.auth.ts.tpl' : 'ui-index.no-auth.ts.tpl'
  );
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
        'docs',
        'screenshots',
      ]);
      const blockedFiles = new Set([
        'netlify.toml',
        'rspress.config.ts',
        'react-template-api.json',
      ]);

      if (blocked.has(firstSegment)) {
        return false;
      }

      if (blockedFiles.has(relative)) {
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
    await buildRouterTs(config),
    'utf8'
  );
  await writeFile(
    path.join(destinationDir, 'src/main.tsx'),
    await buildMainTs(config),
    'utf8'
  );
  await writeFile(
    path.join(destinationDir, 'src/common/ui/layout/app-layout.tsx'),
    await buildAppLayoutTs(config),
    'utf8'
  );
  await writeFile(
    path.join(destinationDir, 'src/common/http-client.ts'),
    await buildHttpClientTs(config),
    'utf8'
  );
  await writeFile(
    path.join(destinationDir, 'src/common/ui/index.ts'),
    await buildUiIndexTs(config),
    'utf8'
  );
  await writeFile(
    path.join(destinationDir, 'src/common/i18n.ts'),
    await buildI18nTs(config),
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
  intro('create-react-template');

  const cliProjectName = process.argv[2]?.trim();
  const projectName =
    cliProjectName || (await askText('Project name', 'my-react-app'));

  if (!projectName) {
    throw new Error('Project name is required.');
  }

  const auth = await askConfirm('Do you want auth?');

  let login = false;
  let register = false;
  let mfa = false;
  let oauth = false;

  if (auth) {
    register = await askConfirm('Do you want registration?');
    login = await askConfirm('Do you want login?');
    mfa = await askConfirm('Do you want mfa?');
    oauth = await askConfirm('Do you want oauth?');

    if (!login) {
      log.warn(
        'Login has been enabled automatically because auth flow redirects unauthenticated users to /login.'
      );
      login = true;
    }
  }

  const advancedForm = await askConfirm(
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

  log.info(`\nSelected features:
- auth: ${config.auth ? 'yes' : 'no'}
- login: ${config.login ? 'yes' : 'no'}
- register: ${config.register ? 'yes' : 'no'}
- mfa: ${config.mfa ? 'yes' : 'no'}
- oauth: ${config.oauth ? 'yes' : 'no'}
- advanced form: ${config.advancedForm ? 'yes' : 'no'}\n`);

  const proceed = await askConfirm('Create project with these options?');
  if (!proceed) {
    outro('Cancelled.');
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

  outro(`Project created at ${destinationDir}

Next steps:
  cd ${projectName}
  pnpm install
  pnpm type-check
  pnpm build`);
}

run().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
