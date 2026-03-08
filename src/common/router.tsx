import { Suspense, lazy, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { AppLayout, AuthLayout, Loading } from '~/common/ui';
import { PrivateRoute, PublicRoute } from '~/common/auth';
import LoginPage from '~/features/login';
import RegisterPage from '~/features/register';

const HomePage = lazy(() => import('~/features/home-page'));
const MfaPage = lazy(() => import('~/features/mfa'));
const OAuthCallbackPage = lazy(() => import('~/features/oauth/callback'));
const AdvancedFormPage = lazy(() => import('~/features/advanced-form'));
const TeamMembersPage = lazy(() => import('~/features/team-members'));
const CreateTeamMemberPage = lazy(
  () => import('~/features/team-members/create')
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
            path: '/team-members',
            element: withSuspense(TeamMembersPage, 'team-members'),
            children: [
              {
                path: 'create',
                element: withSuspense(
                  CreateTeamMemberPage,
                  'create-team-member'
                ),
              },
            ],
          },
          {
            path: '/advanced-form',
            element: withSuspense(AdvancedFormPage, 'advanced-form'),
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
