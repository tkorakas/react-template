import { Suspense, lazy, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { PrivateRoute, PublicRoute } from '~/common/auth';
import LoginPage from '~/features/login';
import RegisterPage from '~/features/register';
import { Loading } from '~/ui';

const AboutPage = lazy(() => import('~/features/about-page'));
const HomePage = lazy(() => import('~/features/home-page'));
const MfaPage = lazy(() => import('~/features/mfa'));
const OAuthCallbackPage = lazy(() => import('~/features/oauth/callback'));
const TeamMembersPage = lazy(() => import('~/features/team-members'));
const AppLayout = lazy(() =>
  import('~/ui/app-layout').then(module => ({ default: module.AppLayout }))
);
const AuthLayout = lazy(() =>
  import('~/ui/auth-layout').then(module => ({ default: module.AuthLayout }))
);

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
          {
            path: '/',
            element: withSuspense(HomePage, 'home-page'),
          },
          {
            path: '/about',
            element: withSuspense(AboutPage, 'about-page'),
          },
          {
            path: '/team-members',
            element: withSuspense(TeamMembersPage, 'team-members'),
          },
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/register',
            element: <RegisterPage />,
          },
          {
            path: '/mfa',
            element: withSuspense(MfaPage, 'mfa-page'),
          },
        ],
      },
      {
        path: '/oauth/:provider/callback',
        element: withSuspense(OAuthCallbackPage, 'oauth-callback-page'),
      },
    ],
  },
]);
