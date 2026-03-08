import { Suspense, lazy, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { AppLayout, AuthLayout, Loading } from '~/common/ui';
import { PrivateRoute, PublicRoute } from '~/common/auth';
import LoginPage from '~/features/login/login.page';
import RegisterPage from '~/features/register/register.page';

const HomePage = lazy(() => import('~/features/home-page'));
const MfaPage = lazy(() => import('~/features/mfa/mfa.page'));
const OAuthCallbackPage = lazy(
  () => import('~/features/oauth/oauth-callback.page')
);
const AdvancedFormPage = lazy(
  () => import('~/features/advanced-form/advanced-form.page')
);
const TeamMembersPage = lazy(
  () => import('~/features/team-members/team-members.page')
);
const CreateTeamMemberPage = lazy(
  () => import('~/features/team-members/create/create-team-member.page')
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
